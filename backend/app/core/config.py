
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


# Ensure the database URL from settings is parsed safely


class Settings(BaseSettings):
    

    DATABASE_URL: str

    SECRET_KEY: str = Field(min_length=32)

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        gt=0
    )

    FRONTEND_URL: str = "http://localhost:5173"

    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

