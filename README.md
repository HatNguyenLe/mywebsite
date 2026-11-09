# Hat Nguyen Links

Website portfolio tiếng Việt để giới thiệu và quản lý các liên kết cá nhân. Giao diện công khai lấy dữ liệu từ PostgreSQL; quản trị viên có thể đăng nhập để thêm, sửa, ẩn, sắp xếp hoặc xóa liên kết.

## Tính năng

- Trang portfolio responsive theo phong cách dark-tech, gồm Hero, About, Expertise, Work, Research, Experience, Education và Contact.
- Nhóm liên kết theo danh mục và sắp xếp theo thứ tự tùy chỉnh.
- Trang quản trị tại `/admin`.
- Xác thực quản trị bằng JWT có thời hạn.
- API kiểm tra và chuẩn hóa dữ liệu đầu vào.
- Dữ liệu PostgreSQL được lưu trong Docker volume.
- Khởi động toàn bộ React, FastAPI và PostgreSQL bằng Docker Compose.

## Công nghệ

- **Frontend:** React 19, TypeScript, Vite, Nginx
- **Backend:** Python 3.13, FastAPI, SQLAlchemy
- **Database:** PostgreSQL 17
- **Vận hành:** Docker Compose

## Cấu trúc dự án

```text
.
├── backend/
│   ├── app/                 # FastAPI, model và API
│   ├── tests/               # Kiểm thử backend
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/                 # Giao diện React
│   ├── Dockerfile
│   └── nginx.conf
├── .env.example
└── docker-compose.yml
```

## Chạy bằng Docker

### 1. Chuẩn bị biến môi trường

Sao chép file mẫu:

```powershell
Copy-Item .env.example .env
```

Trên macOS hoặc Linux:

```bash
cp .env.example .env
```

Mở `.env` và thay đổi tối thiểu ba giá trị:

```dotenv
POSTGRES_PASSWORD=mat-khau-database-manh
SECRET_KEY=chuoi-ngau-nhien-it-nhat-32-ky-tu
ADMIN_PASSWORD=mat-khau-quan-tri-manh
```

Có thể tạo `SECRET_KEY` bằng Python:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Không commit file `.env` lên Git.

### 2. Khởi động

```bash
docker compose up --build -d
```

Mở:

- Website: <http://localhost:8080>
- Quản trị: <http://localhost:8080/admin>
- API docs nội bộ container: `http://backend:8000/docs`

Đăng nhập bằng `ADMIN_USERNAME` và `ADMIN_PASSWORD` trong file `.env`.

### 3. Xem trạng thái và log

```bash
docker compose ps
docker compose logs -f
```

### 4. Dừng dịch vụ

```bash
docker compose down
```

Lệnh trên không xóa dữ liệu. Chỉ dùng lệnh sau khi thực sự muốn xóa toàn bộ dữ liệu PostgreSQL:

```bash
docker compose down -v
```

## Phát triển cục bộ

### Backend

Tạo môi trường ảo và cài dependency:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
```

Backend yêu cầu các biến trong `.env`. Khi phát triển không dùng PostgreSQL, có thể đặt:

```dotenv
DATABASE_URL=sqlite:///./portfolio.db
SECRET_KEY=local-development-secret-key-at-least-32-characters
ADMIN_USERNAME=admin
ADMIN_PASSWORD=local-admin-password
```

Chạy API:

```bash
uvicorn app.main:app --reload
```

API chạy tại <http://localhost:8000>, tài liệu Swagger tại <http://localhost:8000/docs>.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại <http://localhost:5173> và tự chuyển tiếp `/api` tới backend ở cổng `8000`.

## API chính

| Method | Endpoint | Quyền | Chức năng |
|---|---|---|---|
| `GET` | `/api/health` | Công khai | Kiểm tra API |
| `GET` | `/api/links` | Công khai | Danh sách liên kết đang hiển thị |
| `POST` | `/api/auth/login` | Công khai | Đăng nhập quản trị |
| `GET` | `/api/admin/links` | Admin | Danh sách đầy đủ |
| `POST` | `/api/admin/links` | Admin | Thêm liên kết |
| `PATCH` | `/api/admin/links/{id}` | Admin | Sửa liên kết |
| `DELETE` | `/api/admin/links/{id}` | Admin | Xóa liên kết |

## Kiểm thử và kiểm tra mã

Backend:

```bash
cd backend
pytest
ruff check .
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Triển khai

Docker Compose hiện chỉ công khai cổng frontend. Nginx chuyển tiếp các request `/api` tới backend trong mạng Docker nội bộ; PostgreSQL không mở cổng ra host.

Khi triển khai Internet:

1. Dùng mật khẩu và `SECRET_KEY` riêng, đủ mạnh.
2. Đặt reverse proxy có HTTPS phía trước cổng ứng dụng.
3. Cập nhật `FRONTEND_ORIGINS` thành domain thật.
4. Thiết lập sao lưu định kỳ cho volume PostgreSQL.

## Designed by Mansooho Ng and Samuel Ng
