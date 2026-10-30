"""Payment model — specs/05-data-model.md §4.7."""
from sqlalchemy import DECIMAL, TIMESTAMP, Column, Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base

# ENUM values
PAYMENT_METHODS = ("qris", "manual_transfer")
PAYMENT_STATUSES = ("pending", "verified", "rejected")


class Payment(Base):
    """Payment record for an order (one-to-one with orders)."""

    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, unique=True)
    method = Column(
        Enum(*PAYMENT_METHODS, name="payment_method_enum"),
        default="qris",
    )
    amount = Column(DECIMAL(12, 2), nullable=False)
    qris_payload = Column(Text, nullable=True)  # raw QRIS string (for regenerate QR)
    proof_image_url = Column(String(500), nullable=True)  # Cloudinary URL of payment proof
    status = Column(
        Enum(*PAYMENT_STATUSES, name="payment_status_enum"),
        default="pending",
    )
    verified_by = Column(Integer, nullable=True)  # FK to admins.id (no DB constraint — polymorphic-safe)
    verified_at = Column(TIMESTAMP, nullable=True)
    rejection_reason = Column(Text, nullable=True)  # required if status='rejected'
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # NOTE: Index name prefixed with table name for DB-agnostic compatibility.
    # SQLite requires globally-unique index names (MySQL allows per-table duplicates).
    __table_args__ = (
        Index("idx_payments_status", "status"),
    )

    def __repr__(self) -> str:
        return f"<Payment id={self.id} order_id={self.order_id} status={self.status!r}>"
