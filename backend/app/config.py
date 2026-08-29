from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from pathlib import Path


# backend folder
BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "CataractAI"
    DEBUG: bool = True
    VERSION: str = "1.0.0"

    # Database
    MONGODB_URI: str = Field(
        default="mongodb://localhost:27017/cataractai",
        validation_alias=AliasChoices("MONGODB_URI", "MONGODB_URL"),
    )

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173"
    ]

    model_config = SettingsConfigDict(
        env_file=[BASE_DIR / ".env", BASE_DIR.parent / ".env"],
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()