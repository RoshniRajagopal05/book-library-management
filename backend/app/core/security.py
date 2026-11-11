
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from app.core.config import settings


password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:

    return password_hasher.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    return password_hasher.verify(
        plain_password,
        hashed_password
    )


def create_access_token(subject: str) -> str:

    expiration_time = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": subject,
        "exp": expiration_time
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return token


def decode_access_token(token: str) -> dict:

    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM]
    )
