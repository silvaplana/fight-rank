import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# SQLite file lives next to the app by default; override with DATABASE_URL
# (e.g. postgresql://... ) if this ever needs to grow beyond a single file.
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'fightrank.db'}")

MEDIA_DIR = Path(os.getenv("MEDIA_DIR", BASE_DIR / "media"))
VIDEOS_DIR = MEDIA_DIR / "videos"

# In production, set a real secret via the SECRET_KEY env var (docker-compose / .env).
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
TOKEN_EXPIRE_HOURS = int(os.getenv("TOKEN_EXPIRE_HOURS", "24"))

# Comma-separated list, e.g. "https://sivaplana.cloud"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")

DEFAULT_ORGANIZATION = "ASC Sambo Combat La Ciotat"

WEIGHT_CATEGORIES = [
    "Fly Weight",
    "Light Weight",
    "Welter Weight",
    "Middle Weight",
    "Light Heavy Weight",
    "Heavy Weight",
]

RESULTS = ["Win", "Loss", "Draw"]
DESCRIPTIONS = ["Draw", "Decision", "TKO", "Submission"]
