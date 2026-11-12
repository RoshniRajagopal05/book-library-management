
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user

from app.models.user import User

from app.schemas.book import (
    BookCreate,
    BookResponse,
    BookStatusUpdate
)

from app.services.book_service import (
    create_book,
    get_user_books,
    update_book_status
)


router = APIRouter(
    prefix="/books",
    tags=["Books"]
)


# 1. Add a new book
@router.post(
    "/",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED
)
def add_book(
    book_data: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    book = create_book(
        db,
        book_data,
        current_user
    )

    return book


# 2. Get all books belonging to the logged-in user
@router.get(
    "/",
    response_model=List[BookResponse]
)
def list_books(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    books = get_user_books(
        db,
        current_user
    )

    return books


# 3. Update book reading status
@router.patch(
    "/{book_id}/status",
    response_model=BookResponse
)
def change_book_status(
    book_id: int,
    status_data: BookStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    book = update_book_status(
        db,
        book_id,
        status_data.status,
        current_user
    )

    if book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )

    return book
