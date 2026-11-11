
import logging

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


logger = logging.getLogger(__name__)


def get_user_by_email(
    db: Session,
    email: str
) -> User | None:

    statement = select(User).where(
        User.email == email
    )

    return db.scalar(statement)


def register_user(
    db: Session,
    user_data: UserCreate
) -> User:

    existing_user = get_user_by_email(
        db,
        str(user_data.email).lower()
    )

    if existing_user:
        raise ValueError("Email is already registered")

    user = User(
        username=user_data.username,
        email=str(user_data.email).lower(),
        hashed_password=hash_password(
            user_data.password
        )
    )

    try:

        db.add(user)
        db.commit()
        db.refresh(user)

        logger.info(
            "User registered successfully: user_id=%s",
            user.id
        )

        return user

    except IntegrityError:

        db.rollback()

        logger.warning(
            "User registration failed due to duplicate data"
        )

        raise ValueError("Email is already registered")


def authenticate_user(
    db: Session,
    email: str,
    password: str
) -> User | None:

    user = get_user_by_email(
        db,
        email.lower()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.hashed_password
    ):
        return None

    logger.info(
        "User authentication successful: user_id=%s",
        user.id
    )

    return user
