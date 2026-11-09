from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = Field(alias="DATABASE_URL")
    secret_key: str = Field(min_length=32, alias="SECRET_KEY")
    admin_username: str = Field(min_length=3, alias="ADMIN_USERNAME")
    admin_password: str = Field(min_length=8, alias="ADMIN_PASSWORD")
    frontend_origins: str = Field(
        default="http://localhost:5173,http://localhost:8080",
        alias="FRONTEND_ORIGINS",
    )
    access_token_expire_minutes: int = Field(
        default=480,
        alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.frontend_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
