from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config.database import database
from app.config.settings import (
    ALLOWED_ORIGINS,
    ALLOWED_METHODS,
)

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=ALLOWED_METHODS,
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "FastAPI Backend",
    }