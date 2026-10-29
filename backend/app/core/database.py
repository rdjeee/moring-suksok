"""
SQLAlchemy database engine, session factory, and declarative Base.

DB-agnostic: works for both SQLite (sandbox) and MySQL (production).
The connection is configured automatically based on DATABASE_URL.
"""
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.core.config import settings

# SQLite needs check_same_thread=False for FastAPI's threaded request handling.
connect_args: dict = {}
if settings.is_sqlite:
    connect_args["check_same_thread"] = False

# Create the SQLAlchemy engine.
# `echo=settings.SQL_ECHO` logs SQL statements — controlled independently from DEBUG
# via SQL_ECHO env var (default false). Set SQL_ECHO=true in .env to debug SQL.
# `future=True` enables SQLAlchemy 2.0 style.
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=settings.SQL_ECHO,
    future=True,
)

# Session factory — use `with SessionLocal() as session:` or the `get_db()` dependency.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True,
)

# Declarative base — all models inherit from this.
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session and closes it after the request.

    Usage in a route::

        from app.core.database import get_db

        @app.get("/items")
        def list_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
