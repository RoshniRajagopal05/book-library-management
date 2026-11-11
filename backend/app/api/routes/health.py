
import logging

from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.db.database import engine


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get("/")
def health_check():

    return {
        "status": "healthy",
        "message": "Book Library API is running"
    }


@router.get("/database")
def database_health_check():

    try:

        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except SQLAlchemyError:

        logger.exception(
            "Database health check failed"
        )

        raise HTTPException(
            status_code=503,
            detail="Database connection unavailable"
        )
