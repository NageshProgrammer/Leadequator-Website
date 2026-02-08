import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    """Create and return a new DB connection."""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise RuntimeError("DATABASE_URL not set in environment")

    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    return conn


def get_cursor():
    """Return a (cursor, conn) tuple. Caller must close the connection."""
    conn = get_connection()
    return conn.cursor(), conn
