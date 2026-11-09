"""
Auth router — spec 06-api-contracts.md §2.1.

Endpoints:
  POST   /auth/register      — Registrasi customer baru (public)
  POST   /auth/login         — Login customer (public)
  POST   /auth/admin/login   — Login admin (public)
  POST   /auth/refresh       — Refresh JWT token (auth required)
  POST   /auth/logout        — Logout (auth required)
  GET    /auth/me            — Get current user profile (auth required)
  PATCH  /auth/me            — Update own profile (auth required)

Response format: { success, message, data, meta: { token, expires_at } }
"""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.models.admin import Admin
from app.models.customer import Customer
from app.schemas.auth import (
    AdminData,
    CustomerData,
    CustomerProfileData,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest,
)
from app.schemas.common import SuccessResponse, TokenMeta
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


# ---------------------------------------------------------------------------
# Helper: build token meta
# ---------------------------------------------------------------------------
def _token_meta(user_id: int, role: str) -> TokenMeta:
    """Generate JWT token + expiry metadata."""
    token = create_access_token(subject=user_id, role=role)
    expire_minutes = (
        settings.ACCESS_TOKEN_EXPIRE_MINUTES_ADMIN
        if role == "admin"
        else settings.ACCESS_TOKEN_EXPIRE_MINUTES_CUSTOMER
    )
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)).isoformat()
    return TokenMeta(token=token, expires_at=expires_at)


# ---------------------------------------------------------------------------
# POST /auth/register — spec §2.1.1
# ---------------------------------------------------------------------------
@router.post("/register", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Registrasi customer baru."""
    # Check email uniqueness
    existing = db.query(Customer).filter(Customer.email == req.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar. Silakan login atau gunakan email lain.",
        )

    # Create customer
    from app.core.security import hash_password

    customer = Customer(
        email=req.email,
        password_hash=hash_password(req.password),
        name=req.name,
        phone=req.phone,
        address=req.address,
        customer_type=req.customer_type,
        is_active=True,
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)

    token_meta = _token_meta(customer.id, "customer")
    return SuccessResponse(
        success=True,
        message="Registrasi berhasil! Selamat datang di Moring Suksok 🌿",
        data=CustomerData(
            id=customer.id,
            email=customer.email,
            name=customer.name,
            customer_type=customer.customer_type,
        ),
        meta=token_meta,
    )


# ---------------------------------------------------------------------------
# POST /auth/login — spec §2.1.2
# ---------------------------------------------------------------------------
@router.post("/login", response_model=SuccessResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Login customer."""
    customer = db.query(Customer).filter(Customer.email == req.email).first()
    if not customer or not verify_password(req.password, customer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah.",
        )
    if not customer.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda dinonaktifkan. Hubungi admin.",
        )

    token_meta = _token_meta(customer.id, "customer")
    return SuccessResponse(
        success=True,
        message="Login berhasil",
        data=CustomerData(
            id=customer.id,
            email=customer.email,
            name=customer.name,
            customer_type=customer.customer_type,
        ),
        meta=token_meta,
    )


# ---------------------------------------------------------------------------
# POST /auth/admin/login — spec §2.1.3
# ---------------------------------------------------------------------------
@router.post("/admin/login", response_model=SuccessResponse)
def admin_login(req: LoginRequest, db: Session = Depends(get_db)):
    """Login admin (owner). Separate endpoint for security."""
    admin = db.query(Admin).filter(Admin.email == req.email).first()
    if not admin or not verify_password(req.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password admin salah.",
        )

    token_meta = _token_meta(admin.id, "admin")
    return SuccessResponse(
        success=True,
        message="Login admin berhasil",
        data=AdminData(
            id=admin.id,
            email=admin.email,
            name=admin.name,
            phone=admin.phone,
            role="admin",
        ),
        meta=token_meta,
    )


# ---------------------------------------------------------------------------
# POST /auth/refresh — refresh JWT token
# ---------------------------------------------------------------------------
@router.post("/refresh", response_model=SuccessResponse)
def refresh_token(current_user=Depends(get_current_user)):
    """Refresh JWT token (generate new token with fresh expiry)."""
    role = "admin" if isinstance(current_user, Admin) else "customer"
    token_meta = _token_meta(current_user.id, role)

    if role == "admin":
        data = AdminData(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            phone=current_user.phone,
            role="admin",
        )
    else:
        data = CustomerData(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            customer_type=current_user.customer_type,
        )

    return SuccessResponse(
        success=True,
        message="Token berhasil diperbarui",
        data=data,
        meta=token_meta,
    )


# ---------------------------------------------------------------------------
# POST /auth/logout
# ---------------------------------------------------------------------------
@router.post("/logout", response_model=SuccessResponse)
def logout(current_user=Depends(get_current_user)):
    """Logout. (Stateless JWT — client just discards token.

    For production, add token to a blacklist/Redis. For TA, stateless is fine.)
    """
    name = current_user.name
    return SuccessResponse(
        success=True,
        message=f"Logout berhasil. Sampai jumpa, {name}! 🌿",
        data=None,
    )


# ---------------------------------------------------------------------------
# GET /auth/me — spec §2.1.4
# ---------------------------------------------------------------------------
@router.get("/me", response_model=SuccessResponse)
def get_me(current_user=Depends(get_current_user)):
    """Get current user profile."""
    if isinstance(current_user, Admin):
        data = AdminData(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            phone=current_user.phone,
            role="admin",
        )
    else:
        data = CustomerProfileData(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            phone=current_user.phone,
            address=current_user.address,
            customer_type=current_user.customer_type,
            fcm_token=current_user.fcm_token,
            created_at=current_user.created_at,
        )

    return SuccessResponse(success=True, message="Profile retrieved", data=data)


# ---------------------------------------------------------------------------
# PATCH /auth/me — spec §2.1.5
# ---------------------------------------------------------------------------
@router.patch("/me", response_model=SuccessResponse)
def update_me(
    req: UpdateProfileRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update own profile (name, phone, address, fcm_token)."""
    if isinstance(current_user, Admin):
        # Admin can update name, phone
        if req.name is not None:
            current_user.name = req.name
        if req.phone is not None:
            current_user.phone = req.phone
        data = AdminData(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            phone=current_user.phone,
            role="admin",
        )
    else:
        # Customer can update name, phone, address, fcm_token
        if req.name is not None:
            current_user.name = req.name
        if req.phone is not None:
            current_user.phone = req.phone
        if req.address is not None:
            current_user.address = req.address
        if req.fcm_token is not None:
            current_user.fcm_token = req.fcm_token

        data = CustomerProfileData(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            phone=current_user.phone,
            address=current_user.address,
            customer_type=current_user.customer_type,
            fcm_token=current_user.fcm_token,
            created_at=current_user.created_at,
        )

    db.commit()
    db.refresh(current_user)

    return SuccessResponse(success=True, message="Profile berhasil diperbarui", data=data)
