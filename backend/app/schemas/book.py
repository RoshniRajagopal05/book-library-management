
from pydantic import BaseModel, Field, ConfigDict
from typing import Literal
from datetime import datetime


# Allowed reading statuses
ReadingStatus = Literal[
    "Want to Read",
    "Currently Reading",
    "Completed"
]


# Schema for adding a book
class BookCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    author: str = Field(min_length=1, max_length=150)
    status: ReadingStatus = "Want to Read"


# Schema for updating reading status
class BookStatusUpdate(BaseModel):

    status: ReadingStatus


# Schema for displaying book details
class BookResponse(BaseModel):

    id: int
    title: str
    author: str
    status: ReadingStatus
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
