"""Product model — specs/05-data-model.md §4.3."""
from sqlalchemy import BOOLEAN, DECIMAL, TIMESTAMP, Column, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class Product(Base):
    """Snack/kripik moring product (has one or more variants)."""

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    slug = Column(String(150), nullable=False, unique=True)  # URL-friendly, e.g. kripik-moring-original
    description = Column(Text, nullable=True)
    category = Column(String(50), default="snack")
    base_price = Column(DECIMAL(12, 2), nullable=False)  # max 999,999,999.99
    is_active = Column(BOOLEAN, default=True)  # soft delete (false = hidden from catalog)
    image_url = Column(String(500), nullable=True)  # Cloudinary URL after upload
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        return f"<Product id={self.id} slug={self.slug!r} price={self.base_price}>"
