from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import ALLOWED_ORIGINS, MEDIA_DIR
from .database import init_db
from .routers import auth, fighters, fights, organizations


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="FightRank API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")

app.include_router(auth.router)
app.include_router(fighters.router)
app.include_router(fights.router)
app.include_router(organizations.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
