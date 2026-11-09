"""FastAPI dependencies untuk auth (JWT verification, role-based access).

Spec reference:
  - specs/06-api-contracts.md §1.2 (Auth: Bearer Token JWT)
  - specs/08-acceptance-criteria.md E1-S7 (JWT verification middleware)

Usage::

    from app.api.deps import get_current_user, get_current_admin

    @router.get("/me")
    def get_me(current_user: Customer = Depends(get_current_user)):
        return current_user

    @router.get("/admin/dashboard")
    def admin_only(admin: Admin = Depends(get_current_admin)):
        return admin
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.admin import Admin
from app.models.customer import Customer

# Bearer token security scheme for OpenAPI docs
security = HTTPBearer(auto_error=False)


def _extract_token(credentials: HTTPAuthorizationCredentials | None) -> str:
    """Extract & validate Bearer token from Authorization header."""
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token autentikasi tidak ditemukan. Gunakan header: Authorization: Bearer <token>",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials


def _decode_token(token: str) -> dict:
    """Decode JWT token, raise 401 if invalid/expired."""
    try:
        payload = decode_access_token(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau sudah kedaluwarsa. Silakan login kembali.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None
    return payload


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> Customer | Admin:
    """Get current authenticated user (customer OR admin) from JWT token.

    Returns Customer or Admin model instance based on role claim in token.
    Raises 401 if token missing/invalid, 404 if user not found in DB.
    """
    token = _extract_token(credentials)
    payload = _decode_token(token)

    role = payload.get("role")
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Token tidak valid: missing subject")

    if role == "admin":
        user = db.query(Admin).filter(Admin.id == int(user_id)).first()
    elif role == "customer":
        user = db.query(Customer).filter(Customer.id == int(user_id)).first()
    else:
        raise HTTPException(status_code=401, detail="Token tidak valid: unknown role")

    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    # For customers: check is_active (soft delete)
    if isinstance(user, Customer) and not user.is_active:
        raise HTTPException(status_code=403, detail="Akun Anda dinonaktifkan. Hubungi admin.")

    return user


def get_current_customer(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> Customer:
    """Get current authenticated CUSTOMER only. Raises 403 if admin or non-customer."""
    user = get_current_user(credentials, db)
    if not isinstance(user, Customer):
        raise HTTPException(status_code=403, detail="Akses ditolak: endpoint khusus customer")
    return user


def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> Admin:
    """Get current authenticated ADMIN only. Raises 403 if customer or non-admin."""
    token = _extract_token(credentials)
    payload = _decode_token(token)

    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak: endpoint khusus admin")

    user_id = payload.get("sub")
    admin = db.query(Admin).filter(Admin.id == int(user_id)).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin tidak ditemukan")

    return admin
