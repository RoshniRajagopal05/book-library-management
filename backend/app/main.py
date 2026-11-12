
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health
from app.core.config import settings
from app.core.logging_config import configure_logging
from app.middleware.request_logging import RequestLoggingMiddleware
from app.api.routes import auth
from app.api.routes import books

configure_logging()

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("Book Library API starting")

    yield

    logger.info("Book Library API shutting down")


app = FastAPI(
    title="Book Library Management API",
    description="Backend API for personal book collections",
    version="1.0.0",
    lifespan=lifespan
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"]
)


# Request logging
app.add_middleware(RequestLoggingMiddleware)


# Register API routers
app.include_router(health.router)

app.include_router(
    auth.router,
    prefix="/api"
)
app.include_router(books.router, prefix="/api")


@app.get("/")
def root():

    return {
        "message": "Welcome to Book Library Management API",
        "documentation": "/docs"
    }
