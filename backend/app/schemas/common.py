"""Common Pydantic response schemas (spec 06-api-contracts.md §1.4-1.5)."""
from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Meta(BaseModel):
    """Pagination & extra metadata."""
    page: int | None = None
    per_page: int | None = None
    total: int | None = None
    total_pages: int | None = None


class TokenMeta(BaseModel):
    """Token metadata returned with auth responses."""
    token: str
    token_type: str = "Bearer"
    expires_at: str  # ISO 8601


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success response: { success, message, data, meta }."""
    success: bool = True
    message: str = "Operasi berhasil"
    data: T | None = None
    meta: Any = None


class ErrorResponse(BaseModel):
    """Standard error response."""
    success: bool = False
    message: str
    errors: list[dict[str, str]] | None = None
