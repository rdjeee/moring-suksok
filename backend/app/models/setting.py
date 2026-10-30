"""Setting model — specs/05-data-model.md §4.9."""
from sqlalchemy import TIMESTAMP, Column, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class Setting(Base):
    """Key-value system configuration (QRIS owner, business info, shipping cost, etc.)."""

    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key_name = Column(String(100), nullable=False, unique=True)
    value = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        return f"<Setting id={self.id} key={self.key_name!r}>"
