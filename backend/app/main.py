from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .config import Settings, get_settings
from .database import Base, SessionLocal, engine, get_db
from .models import Link
from .schemas import (
    HealthResponse,
    LinkCreate,
    LinkResponse,
    LinkUpdate,
    LoginRequest,
    TokenResponse,
)
from .security import authenticate_admin, create_access_token, require_admin


SAMPLE_LINKS = [
    Link(
        title="GitHub",
        url="https://github.com/HatNguyenLe",
        description="Mã nguồn và các dự án phần mềm.",
        category="Mạng xã hội",
        sort_order=10,
    ),
    Link(
        title="LinkedIn",
        url="https://www.linkedin.com/",
        description="Kết nối và hồ sơ nghề nghiệp.",
        category="Mạng xã hội",
        sort_order=20,
    ),
    Link(
        title="Portfolio",
        url="https://hatnguyenle.github.io/hathat/",
        description="Thông tin về kinh nghiệm và các dự án tiêu biểu.",
        category="Website",
        sort_order=30,
    ),
]


def seed_links() -> None:
    with SessionLocal() as session:
        count = session.scalar(select(func.count()).select_from(Link))
        if count == 0:
            session.add_all(SAMPLE_LINKS)
            session.commit()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    Base.metadata.create_all(bind=engine)
    seed_links()
    yield


app = FastAPI(
    title="Link Portfolio API",
    version="1.0.0",
    lifespan=lifespan,
)
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DbSession = Annotated[Session, Depends(get_db)]
AdminUser = Annotated[str, Depends(require_admin)]


@app.get("/api/health", response_model=HealthResponse, tags=["system"])
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/api/auth/login", response_model=TokenResponse, tags=["authentication"])
def login(
    credentials: LoginRequest,
    app_settings: Annotated[Settings, Depends(get_settings)],
) -> TokenResponse:
    if not authenticate_admin(credentials, app_settings):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không đúng",
        )
    return TokenResponse(access_token=create_access_token(app_settings))


@app.get("/api/links", response_model=list[LinkResponse], tags=["links"])
def list_public_links(
    db: DbSession,
    category: str | None = Query(default=None, max_length=80),
) -> list[Link]:
    query = select(Link).where(Link.is_active.is_(True))
    if category:
        query = query.where(Link.category == category)
    query = query.order_by(Link.sort_order, Link.id)
    return list(db.scalars(query))


@app.get(
    "/api/admin/links",
    response_model=list[LinkResponse],
    tags=["admin"],
)
def list_admin_links(db: DbSession, _: AdminUser) -> list[Link]:
    return list(db.scalars(select(Link).order_by(Link.sort_order, Link.id)))


@app.post(
    "/api/admin/links",
    response_model=LinkResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["admin"],
)
def create_link(payload: LinkCreate, db: DbSession, _: AdminUser) -> Link:
    link = Link(**payload.model_dump(mode="json"))
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


def get_link_or_404(link_id: int, db: Session) -> Link:
    link = db.get(Link, link_id)
    if link is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy liên kết",
        )
    return link


@app.patch(
    "/api/admin/links/{link_id}",
    response_model=LinkResponse,
    tags=["admin"],
)
def update_link(
    link_id: int,
    payload: LinkUpdate,
    db: DbSession,
    _: AdminUser,
) -> Link:
    link = get_link_or_404(link_id, db)
    updates = payload.model_dump(exclude_unset=True, mode="json")
    for field, value in updates.items():
        setattr(link, field, value)
    db.commit()
    db.refresh(link)
    return link


@app.delete(
    "/api/admin/links/{link_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["admin"],
)
def delete_link(link_id: int, db: DbSession, _: AdminUser) -> None:
    link = get_link_or_404(link_id, db)
    db.delete(link)
    db.commit()
