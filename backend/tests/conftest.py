import os

import pytest
from fastapi.testclient import TestClient


os.environ.update(
    {
        "DATABASE_URL": "sqlite:///:memory:",
        "SECRET_KEY": "test-secret-key-with-at-least-32-characters",
        "ADMIN_USERNAME": "test-admin",
        "ADMIN_PASSWORD": "test-password",
    }
)

from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
def admin_headers(client: TestClient) -> dict[str, str]:
    response = client.post(
        "/api/auth/login",
        json={"username": "test-admin", "password": "test-password"},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}
