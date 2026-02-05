import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# ------------------------------------------------------------------
# LOAD ROOT .env (ai-service/.env)
# ------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set. Check ai-service/.env")

conn = psycopg2.connect(DATABASE_URL)
conn.autocommit = True

def get_cursor():
    return conn.cursor()
