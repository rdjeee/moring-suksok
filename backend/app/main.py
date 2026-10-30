"""
Moring Suksok — FastAPI application entry point.

Run (dev)::

    cd backend
    source venv/bin/activate
    uvicorn app.main:app --reload --port 8000

Swagger UI: http://localhost:8000/docs
ReDoc:      http://localhost:8000/redoc

This is a minimal skeleton — routers will be wired in later steps per specs/06-api-contracts.md.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Sistem Distribusi & Pencatatan Transaksi Produk Moring Suksok — Backend API. "
        "Tugas Akhir mini e-commerce UMKM snack kripik daun kelor."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ---------------------------------------------------------------------------
# CORS — allow frontend origins (Next.js dev on :3000, Vercel prod)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health & info endpoints
# ---------------------------------------------------------------------------
@app.get("/", tags=["meta"])
def root() -> dict:
    """Root — basic API info."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "env": settings.APP_ENV,
        "docs": "/docs",
    }


@app.get("/health", tags=["meta"])
def health() -> dict:
    """Health check — used for uptime monitoring & Docker healthcheck."""
    return {
        "status": "ok",
        "db_engine": "sqlite" if settings.is_sqlite else "mysql" if settings.is_mysql else "unknown",
    }


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
from app.api.v1 import auth  # noqa: E402

API_V1_PREFIX = "/api/v1"
app.include_router(auth.router, prefix=API_V1_PREFIX)
