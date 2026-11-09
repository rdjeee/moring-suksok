"""Auth Pydantic schemas (spec 06-api-contracts.md §2.1)."""
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------
class RegisterRequest(BaseModel):
    """POST /auth/register — spec §2.1.1."""
    name: str = Field(..., min_length=3, max_length=100, description="Nama lengkap")
    email: EmailStr = Field(..., description="Email unik")
    phone: str = Field(..., min_length=10, max_length=20, description="Format 08xxx atau +62xxx")
    password: str = Field(..., min_length=8, max_length=100, description="Min 8 chars, letter+number")
    address: str = Field(..., min_length=10, description="Alamat pengiriman")
    customer_type: str = Field("public", pattern="^(retail|public)$", description="Segmen customer")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Must contain at least one letter and one number."""
        if not any(c.isalpha() for c in v):
            raise ValueError("Password harus mengandung huruf")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password harus mengandung angka")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        """Format: 08xxx or +62xxx."""
        v = v.strip()
        if not (v.startswith("08") or v.startswith("+62")):
            raise ValueError("Nomor telepon harus format 08xxx atau +62xxx")
        return v


class LoginRequest(BaseModel):
    """POST /auth/login & /auth/admin/login."""
    email: EmailStr
    password: str


class UpdateProfileRequest(BaseModel):
    """PATCH /auth/me — spec §2.1.5."""
    name: str | None = Field(None, min_length=3, max_length=100)
    phone: str | None = Field(None, min_length=10, max_length=20)
    address: str | None = Field(None, min_length=10)
    fcm_token: str | None = None


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------
class CustomerData(BaseModel):
    """Customer data returned in auth responses (no password_hash).

    Fields id, email, name, customer_type are always present.
    phone, address, created_at are optional (not always returned, per spec §2.1.1-2.1.2).
    """
    id: int
    email: str
    name: str
    customer_type: str
    phone: str | None = None
    address: str | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class AdminData(BaseModel):
    """Admin data returned in auth responses."""
    id: int
    email: str
    name: str
    phone: str | None = None
    role: str = "admin"

    model_config = {"from_attributes": True}


class CustomerProfileData(BaseModel):
    """Full customer profile for GET /auth/me (spec §2.1.4)."""
    id: int
    email: str
    name: str
    phone: str
    address: str
    customer_type: str
    fcm_token: str | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}
