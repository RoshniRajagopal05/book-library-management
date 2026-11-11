
from fastapi import FastAPI

app = FastAPI(
    title="Book Library Management API",
    description="API for managing personal book collections",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Book Library Management API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
