"""Admin model — specs/05-data-model.md §4.1."""
from sqlalchemy import TIMESTAMP, Column, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class Admin(Base):
    """Admin/owner account (login via email + password)."""

    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)  # bcrypt, 12 rounds
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        return f"<Admin id={self.id} email={self.email!r}>"
