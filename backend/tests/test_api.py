from fastapi.testclient import TestClient


def test_health(client: TestClient) -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_public_links_returns_seed_data(client: TestClient) -> None:
    response = client.get("/api/links")
    assert response.status_code == 200
    links = response.json()
    assert len(links) == 3
    assert all(link["is_active"] for link in links)


def test_login_rejects_invalid_credentials(client: TestClient) -> None:
    response = client.post(
        "/api/auth/login",
        json={"username": "test-admin", "password": "wrong-password"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Tên đăng nhập hoặc mật khẩu không đúng"


def test_admin_endpoint_requires_token(client: TestClient) -> None:
    response = client.get("/api/admin/links")
    assert response.status_code == 401


def test_admin_can_create_update_and_delete_link(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    create_response = client.post(
        "/api/admin/links",
        headers=admin_headers,
        json={
            "title": "Tài liệu",
            "url": "https://example.com/docs",
            "description": "Tài liệu dự án",
            "category": "Tài nguyên",
            "is_active": True,
            "sort_order": 5,
        },
    )
    assert create_response.status_code == 201
    link = create_response.json()

    update_response = client.patch(
        f"/api/admin/links/{link['id']}",
        headers=admin_headers,
        json={"title": "Tài liệu mới", "is_active": False},
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Tài liệu mới"
    assert update_response.json()["is_active"] is False

    public_response = client.get("/api/links")
    assert link["id"] not in {item["id"] for item in public_response.json()}

    delete_response = client.delete(
        f"/api/admin/links/{link['id']}",
        headers=admin_headers,
    )
    assert delete_response.status_code == 204

    missing_response = client.patch(
        f"/api/admin/links/{link['id']}",
        headers=admin_headers,
        json={"title": "Không tồn tại"},
    )
    assert missing_response.status_code == 404


def test_create_link_rejects_invalid_url(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    response = client.post(
        "/api/admin/links",
        headers=admin_headers,
        json={
            "title": "Liên kết lỗi",
            "url": "javascript:alert(1)",
            "category": "Khác",
            "is_active": True,
            "sort_order": 0,
        },
    )
    assert response.status_code == 422
