from pydantic_settings import BaseSettings
from typing import List


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
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
