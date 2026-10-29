"""
Password hashing & JWT utilities.

Uses passlib + bcrypt for password hashing (salt rounds = 12, per specs/05-data-model.md §4.1).
Uses python-jose for JWT signing/verification (per specs/06-api-contracts.md).
"""
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------
# bcrypt with 12 rounds — matches specs/05-data-model.md §4.1 (admins.password_hash).
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ---------------------------------------------------------------------------
# JWT token utilities
# ---------------------------------------------------------------------------
def create_access_token(
    subject: str | int,
    role: str = "customer",
    extra_claims: dict[str, Any] | None = None,
) -> str:
    """Create a signed JWT access token.

    Args:
        subject: The token subject — typically user ID (str) or email.
        role: Either "customer" or "admin" — determines token expiry.
        extra_claims: Additional claims to embed (e.g. {"email": "...", "name": "..."}).

    Returns:
        Encoded JWT string.
    """
    expire_minutes = (
        settings.ACCESS_TOKEN_EXPIRE_MINUTES_ADMIN
        if role == "admin"
        else settings.ACCESS_TOKEN_EXPIRE_MINUTES_CUSTOMER
    )
    expire = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)

    to_encode: dict[str, Any] = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
    }
    if extra_claims:
        to_encode.update(extra_claims)

    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode & verify a JWT token. Raises jose.JWTError on invalid/expired token."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
