
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.book import Book
from app.models.user import User
from app.schemas.book import BookCreate, ReadingStatus


# Add a new book
def create_book(db, book_data, current_user):

    new_book = Book(
        title=book_data.title,
        author=book_data.author,
        status=book_data.status,
        user_id=current_user.id
    )

    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return new_book

# Get books belonging to the logged-in user
def get_user_books(
    db: Session,
    current_user: User
):

    statement = (
        select(Book)
        .where(Book.user_id == current_user.id)
        .order_by(Book.id.desc())
    )

    result = db.execute(statement)

    return result.scalars().all()


# Update reading status
def update_book_status(
    db: Session,
    book_id: int,
    status: ReadingStatus,
    current_user: User
):

    statement = select(Book).where(
        Book.id == book_id,
        Book.user_id == current_user.id
    )

    book = db.execute(statement).scalar_one_or_none()

    if book is None:
        return None

    book.status = status

    db.commit()
    db.refresh(book)

    return book
