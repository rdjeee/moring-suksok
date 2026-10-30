"""
Application settings — loaded from backend/.env via pydantic-settings.

DB-agnostic: DATABASE_URL can be either:
  - SQLite (sandbox demo):  sqlite:///./moring_suksok_sandbox.db
  - MySQL (production):     mysql+pymysql://root:@localhost:3306/moring_suksok

NOTE: We use python-dotenv with `override=True` to ensure our backend/.env takes
precedence over any DATABASE_URL env var that might be set globally (e.g. the Z.ai
sandbox sets DATABASE_URL=file:/home/z/my-project/db/custom.db for Next.js/Prisma).
On a clean machine (production/Laragon) this is a no-op.
"""
from dotenv import load_dotenv
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve backend/.env relative to this file (config.py is at backend/app/core/config.py).
# This ensures the correct .env is loaded regardless of the current working directory.
_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
_ENV_FILE = _BACKEND_DIR / ".env"

# Load our backend/.env with override=True so our values win over pre-existing env vars.
# This MUST happen before Settings() is instantiated.
# (Z.ai sandbox sets DATABASE_URL=file:/home/z/my-project/db/custom.db globally — we override it.)
load_dotenv(_ENV_FILE, override=True)


class Settings(BaseSettings):
    """Application configuration loaded from environment / .env file."""

    # ------------------------------------------------------------------ #
    # Database
    # ------------------------------------------------------------------ #
    DATABASE_URL: str = "sqlite:///./moring_suksok_sandbox.db"

    # ------------------------------------------------------------------ #
    # JWT Authentication
    # ------------------------------------------------------------------ #
    JWT_SECRET: str = "change-this-to-random-min-32-characters-string"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES_CUSTOMER: int = 10080  # 7 days
    ACCESS_TOKEN_EXPIRE_MINUTES_ADMIN: int = 1440  # 1 day

    # ------------------------------------------------------------------ #
    # Cloudinary (Image Storage)
    # ------------------------------------------------------------------ #
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # ------------------------------------------------------------------ #
    # Firebase Admin SDK (Push Notification)
    # ------------------------------------------------------------------ #
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_PRIVATE_KEY: str = ""
    FIREBASE_CLIENT_EMAIL: str = ""
    FIREBASE_STORAGE_BUCKET: str = ""

    # ------------------------------------------------------------------ #
    # CORS
    # ------------------------------------------------------------------ #
    CORS_ORIGINS: str = "http://localhost:3000"

    # ------------------------------------------------------------------ #
    # App Configuration
    # ------------------------------------------------------------------ #
    APP_NAME: str = "Moring Suksok API"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    SQL_ECHO: bool = False  # Set true to log SQL statements (independent from DEBUG)

    # ------------------------------------------------------------------ #
    # Business Settings (defaults; editable via admin dashboard)
    # ------------------------------------------------------------------ #
    BUSINESS_NAME: str = "Moring Suksok"
    DEFAULT_SHIPPING_COST: int = 10000

    # ------------------------------------------------------------------ #
    # Rate Limiting
    # ------------------------------------------------------------------ #
    RATE_LIMIT_AUTH: str = "5/minute"
    RATE_LIMIT_UPLOAD: str = "10/hour"
    RATE_LIMIT_DEFAULT: str = "60/minute"

    # ------------------------------------------------------------------ #
    # Logging
    # ------------------------------------------------------------------ #
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

    # ------------------------------------------------------------------ #
    # Convenience properties
    # ------------------------------------------------------------------ #
    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS comma-separated string into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_sqlite(self) -> bool:
        """True if current DATABASE_URL points to SQLite (sandbox demo mode)."""
        return self.DATABASE_URL.startswith("sqlite")

    @property
    def is_mysql(self) -> bool:
        """True if current DATABASE_URL points to MySQL (production mode)."""
        return self.DATABASE_URL.startswith("mysql")

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return cached Settings singleton."""
    return Settings()


# Module-level singleton — import this everywhere: `from app.core.config import settings`
settings = get_settings()
