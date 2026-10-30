"""Notification model — specs/05-data-model.md §4.8."""
from sqlalchemy import TIMESTAMP, Column, Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base

# ENUM values
USER_TYPES = ("customer", "admin")
NOTIF_TYPES = ("push", "whatsapp")
NOTIF_STATUSES = ("pending", "sent", "failed")


class Notification(Base):
    """Log of notifications sent (push via FCM, or WhatsApp deep link)."""

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_type = Column(Enum(*USER_TYPES, name="notif_user_type_enum"), nullable=False)
    user_id = Column(Integer, nullable=False)  # polymorphic — FK to customers.id or admins.id
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(Enum(*NOTIF_TYPES, name="notif_type_enum"), nullable=False)  # 'push' or 'whatsapp'
    status = Column(Enum(*NOTIF_STATUSES, name="notif_status_enum"), default="pending")
    related_order_id = Column(
        Integer,
        ForeignKey("orders.id", ondelete="SET NULL"),
        nullable=True,
    )
    wa_link = Column(Text, nullable=True)  # generated wa.me URL (for type='whatsapp')
    created_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        Index("idx_user", "user_type", "user_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<Notification id={self.id} user_type={self.user_type!r} "
            f"user_id={self.user_id} type={self.type!r} status={self.status!r}>"
        )
