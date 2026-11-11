
import logging

import jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.database import get_db
from app.models.user import User


logger = logging.getLogger(__name__)

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
    db: Session = Depends(get_db)
) -> User:

    unauthorized_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"}
    )

    if credentials is None:
        raise unauthorized_exception

    try:

        payload = decode_access_token(
            credentials.credentials
        )

        user_id = payload.get("sub")

        if not user_id:
            raise unauthorized_exception

        user = db.get(User, int(user_id))

        if user is None:
            raise unauthorized_exception

        return user

    except (jwt.InvalidTokenError, ValueError, TypeError):

        logger.warning(
            "Authentication failed: invalid or expired token"
        )

        raise unauthorized_exception
