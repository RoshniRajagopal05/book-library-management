
import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.db.database import get_db

# Import models so SQLAlchemy registers their tables.
from app.models.user import User
from app.models.book import Book


# Create an isolated in-memory SQLite database.
TEST_DATABASE_URL = "sqlite://"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(
    bind=test_engine,
    autoflush=False,
    autocommit=False
)


# Replace the application's database dependency.
def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():

    # Create fresh database tables.
    Base.metadata.create_all(bind=test_engine)

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    # Remove dependency override.
    app.dependency_overrides.clear()

    # Delete test tables after each test.
    Base.metadata.drop_all(bind=test_engine)
