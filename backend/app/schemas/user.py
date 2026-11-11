
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):

    username: str = Field(
        min_length=3,
        max_length=50
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):

        value = value.strip()

        if not value:
            raise ValueError("Username cannot be empty")

        return value


class UserResponse(BaseModel):

    id: int
    username: str
    email: EmailStr

    model_config = ConfigDict(
        from_attributes=True
    )
