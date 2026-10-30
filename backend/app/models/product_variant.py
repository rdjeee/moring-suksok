"""ProductVariant model — specs/05-data-model.md §4.4."""
from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.sql import func

from app.core.database import Base


class ProductVariant(Base):
    """Variant of a product (e.g. 'Original 100gr', 'Original 250gr')."""

    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variant_name = Column(String(100), nullable=False)
    stock = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("product_id", "variant_name", name="uniq_product_variant"),
    )

    def __repr__(self) -> str:
        return f"<ProductVariant id={self.id} product_id={self.product_id} name={self.variant_name!r}>"
