# React & Python Project

Dự án web gồm giao diện người dùng xây dựng bằng React và phần backend/API xây dựng bằng Python.

## Công nghệ

- **Frontend:** React
- **Backend:** Python
- **Quản lý phiên bản:** Git

## Cấu trúc đề xuất

```text
.
├── frontend/          # Ứng dụng React
├── backend/           # Ứng dụng Python và API
├── .gitignore
└── README.md
```

## Yêu cầu

Trước khi bắt đầu, hãy cài đặt:

- Node.js và npm
- Python 3
- Git

## Cài đặt

### Frontend

```bash
cd frontend
npm install
```

Nếu dự án sử dụng Yarn hoặc pnpm, hãy thay `npm` bằng trình quản lý gói tương ứng.

### Backend

Tạo và kích hoạt môi trường ảo:

```bash
cd backend
python -m venv .venv
```

Trên Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Trên macOS hoặc Linux:

```bash
source .venv/bin/activate
```

Cài đặt các thư viện Python:

```bash
pip install -r requirements.txt
```

## Chạy dự án

### Chạy frontend

```bash
cd frontend
npm run dev
```

Tùy theo công cụ khởi tạo React, lệnh chạy có thể là `npm start`.

### Chạy backend

Kích hoạt môi trường ảo, sau đó chạy lệnh phù hợp với framework Python được sử dụng. Ví dụ:

```bash
cd backend
python app.py
```

## Biến môi trường

Không commit file `.env` lên Git. Hãy tạo file `.env.example` chứa tên các biến cần thiết nhưng không chứa khóa bí mật, sau đó sao chép thành `.env` khi phát triển cục bộ.

## Kiểm thử

Chạy kiểm thử frontend:

```bash
cd frontend
npm test
```

Chạy kiểm thử backend:

```bash
cd backend
pytest
```

## Đóng góp

1. Tạo một nhánh mới cho thay đổi.
2. Thực hiện và kiểm thử thay đổi.
3. Tạo commit với mô tả rõ ràng.
4. Mở pull request để xem xét.

## Giấy phép

Chưa xác định.
