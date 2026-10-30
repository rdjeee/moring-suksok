"""Order model — specs/05-data-model.md §4.5."""
from sqlalchemy import DECIMAL, TIMESTAMP, Column, Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base

# ENUM values
CUSTOMER_TYPES = ("retail", "public")
ORDER_STATUSES = ("pending", "processed", "shipped", "done", "cancelled")


class Order(Base):
    """Order header — one record per customer checkout."""

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_code = Column(String(30), nullable=False, unique=True)  # ORD-YYYYMMDD-XXX
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    customer_type = Column(
        Enum(*CUSTOMER_TYPES, name="order_customer_type_enum"),
        nullable=False,
    )  # snapshot for analytics ( survives customer soft-delete )
    shipping_address = Column(Text, nullable=False)
    shipping_method = Column(String(50), nullable=True)  # 'pickup' or 'delivery'
    shipping_cost = Column(DECIMAL(12, 2), default=0)
    subtotal = Column(DECIMAL(12, 2), nullable=False)
    total = Column(DECIMAL(12, 2), nullable=False)
    status = Column(
        Enum(*ORDER_STATUSES, name="order_status_enum"),
        default="pending",
    )
    tracking_number = Column(String(100), nullable=True)  # courier tracking no (filled when shipped)
    notes = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # NOTE: Index names prefixed with table name for DB-agnostic compatibility.
    # SQLite requires globally-unique index names (MySQL allows per-table duplicates).
    # Spec uses `idx_status` etc., but `idx_orders_status` is functionally equivalent.
    __table_args__ = (
        Index("idx_orders_status", "status"),
        Index("idx_orders_customer", "customer_id"),
        Index("idx_orders_created", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Order id={self.id} code={self.order_code!r} status={self.status!r}>"
