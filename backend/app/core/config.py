from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path
from dotenv import dotenv_values
import os

ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./rapidfire.db"
    TAVILY_API_KEY: str = ""
    BIFROST_BASE_URL: str = "http://localhost:8080"
    BIFROST_API_KEY: str = ""
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    APP_ENV: str = "development"

    class Config:
        env_file = str(ENV_PATH)
        env_file_encoding = "utf-8"

    def get_tavily_key(self) -> str:
        if ENV_PATH.exists():
            vals = dotenv_values(ENV_PATH)
            key = vals.get("TAVILY_API_KEY")
            if key and key.strip() and key.strip() != "your_actual_tavily_key_here":
                return key.strip()
        return self.TAVILY_API_KEY or os.getenv("TAVILY_API_KEY", "")


settings = Settings()
