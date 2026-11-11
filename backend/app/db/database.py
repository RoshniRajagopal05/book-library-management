
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


def prepare_database_url(database_url: str):
    """
    Convert the Render PostgreSQL URL into
    the SQLAlchemy Psycopg 3 format.
    """

    database_url = make_url(database_url)

    if database_url.drivername in ("postgres", "postgresql"):
        database_url = database_url.set(
            drivername="postgresql+psycopg"
        )

    if database_url.drivername != "postgresql+psycopg":
        raise ValueError("Unsupported database driver")

    return database_url


engine = create_engine(
    prepare_database_url(settings.DATABASE_URL),
    pool_pre_ping=True
)


SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
