
from sqlalchemy import text
from app.db.database import engine

def test_database_connection():

    try:
        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT 1")
            )

            print("Database connection successful!")
            print("Query result:", result.scalar())

    except Exception:
        print("Database connection failed.")
        raise

if __name__ == "__main__":
    test_database_connection()