import hmac
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError

from .config import Settings, get_settings
from .schemas import LoginRequest


bearer_scheme = HTTPBearer(auto_error=False)


def authenticate_admin(credentials: LoginRequest, settings: Settings) -> bool:
    username_matches = hmac.compare_digest(
        credentials.username,
        settings.admin_username,
    )
    password_matches = hmac.compare_digest(
        credentials.password,
        settings.admin_password,
    )
    return username_matches and password_matches


def create_access_token(settings: Settings) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    return jwt.encode(
        {"sub": settings.admin_username, "exp": expires_at},
        settings.secret_key,
        algorithm="HS256",
    )


def require_admin(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_scheme),
    ],
    settings: Annotated[Settings, Depends(get_settings)],
) -> str:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Phiên đăng nhập không hợp lệ hoặc đã hết hạn",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.secret_key,
            algorithms=["HS256"],
        )
    except InvalidTokenError as error:
        raise unauthorized from error

    username = payload.get("sub")
    if not isinstance(username, str) or not hmac.compare_digest(
        username,
        settings.admin_username,
    ):
        raise unauthorized
    return username
