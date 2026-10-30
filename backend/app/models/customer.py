"""Customer model — specs/05-data-model.md §4.2."""
from sqlalchemy import BOOLEAN, TIMESTAMP, Column, Enum, Index, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base

# ENUM values — DB-agnostic: MySQL native ENUM, SQLite VARCHAR + CHECK.
CUSTOMER_TYPES = ("retail", "public")


class Customer(Base):
    """Customer account — Ritel or Masyarakat (public)."""

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)  # bcrypt, 12 rounds
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(Text, nullable=False)
    customer_type = Column(
        Enum(*CUSTOMER_TYPES, name="customer_type_enum"),
        nullable=False,
        default="public",
    )
    fcm_token = Column(Text, nullable=True)  # Firebase Cloud Messaging token (PWA push)
    is_active = Column(BOOLEAN, default=True)  # soft delete flag
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("idx_customer_type", "customer_type"),
    )

    def __repr__(self) -> str:
        return f"<Customer id={self.id} email={self.email!r} type={self.customer_type!r}>"
