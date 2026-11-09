from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LinkBase(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    url: HttpUrl
    description: str | None = Field(default=None, max_length=500)
    category: str = Field(default="Khác", min_length=1, max_length=80)
    is_active: bool = True
    sort_order: int = Field(default=0, ge=0, le=10000)

    @field_validator("title", "category")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Không được để trống")
        return stripped

    @field_validator("description")
    @classmethod
    def strip_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None


class LinkCreate(LinkBase):
    pass


class LinkUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    url: HttpUrl | None = None
    description: str | None = Field(default=None, max_length=500)
    category: str | None = Field(default=None, min_length=1, max_length=80)
    is_active: bool | None = None
    sort_order: int | None = Field(default=None, ge=0, le=10000)

    @field_validator("title", "category")
    @classmethod
    def strip_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        if not stripped:
            raise ValueError("Không được để trống")
        return stripped

    @field_validator("description")
    @classmethod
    def strip_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None


class LinkResponse(LinkBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HealthResponse(BaseModel):
    status: str
