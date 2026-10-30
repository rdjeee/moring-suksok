"""OrderItem model — specs/05-data-model.md §4.6."""
from sqlalchemy import DECIMAL, Column, ForeignKey, Integer, String, TIMESTAMP
from sqlalchemy.sql import func

from app.core.database import Base


class OrderItem(Base):
    """Line item in an order — snapshot of product/variant/price at checkout time."""

    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    product_name = Column(String(150), nullable=False)  # snapshot
    variant_name = Column(String(100), nullable=True)  # snapshot
    quantity = Column(Integer, nullable=False)
    price_per_unit = Column(DECIMAL(12, 2), nullable=False)  # snapshot
    subtotal = Column(DECIMAL(12, 2), nullable=False)  # quantity * price_per_unit
    created_at = Column(TIMESTAMP, server_default=func.now())

    def __repr__(self) -> str:
        return (
            f"<OrderItem id={self.id} order_id={self.order_id} "
            f"product={self.product_name!r} qty={self.quantity}>"
        )
