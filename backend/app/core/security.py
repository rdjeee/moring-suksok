"""
Password hashing & JWT utilities.

ISSUE-002 FIX (per Agent A NOTIF-003): Switched from passlib to direct bcrypt usage.
passlib 1.7.4 has compatibility issue with bcrypt 4.x (AttributeError: __about__).
Direct bcrypt usage is simpler, more maintainable, and eliminates the warning.

Uses bcrypt directly (12 rounds, per specs/05-data-model.md §4.1).
Uses python-jose for JWT signing/verification (per specs/06-api-contracts.md).
"""
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from jose import jwt

from app.core.config import settings

# ---------------------------------------------------------------------------
# Password hashing (ISSUE-002 fix: direct bcrypt, no passlib)
# ---------------------------------------------------------------------------
# bcrypt with 12 rounds — matches specs/05-data-model.md §4.1 (admins.password_hash).
_BCRYPT_ROUNDS = 12


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt (12 rounds).

    Returns a str like '$2b$12$...'.
    """
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=_BCRYPT_ROUNDS)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a bcrypt hash.

    Returns True if match, False otherwise. Handles invalid hash gracefully.
    """
    try:
        password_bytes = plain_password.encode("utf-8")
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except (ValueError, TypeError):
        return False


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
        "iat": datetime.now(timezone.utc),
    }
    if extra_claims:
        to_encode.update(extra_claims)

    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode & verify a JWT token. Raises jose.JWTError on invalid/expired token."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
