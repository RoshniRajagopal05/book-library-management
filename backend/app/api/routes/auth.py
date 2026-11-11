
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.security import create_access_token
from app.db.database import get_db
from app.models.user import User
from app.schemas.token import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import (
    authenticate_user,
    register_user
)


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    try:

        user = register_user(db, user_data)

        return user

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = authenticate_user(
        db,
        login_data.email,
        login_data.password
    )

    if user is None:

        logger.warning(
            "Login failed: invalid credentials"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(
        subject=str(user.id)
    )

    return TokenResponse(
        access_token=access_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_account(
    current_user: User = Depends(get_current_user)
):

    return current_user
