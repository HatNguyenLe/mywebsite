import { useEffect, useState, type FormEvent } from "react";
import {
  createLink,
  deleteLink,
  getAdminLinks,
  isLoggedIn,
  login,
  logout,
  updateLink,
} from "./api";
import PublicPage from "./PublicPage";
import type { LinkItem, LinkPayload } from "./types";

const emptyLink: LinkPayload = {
  title: "",
  url: "",
  description: "",
  category: "Website",
  is_active: true,
  sort_order: 0,
};

interface LoginFormProps {
  onSuccess: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      onSuccess();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <a className="brand" href="/">
          HN<span>.</span>
        </a>
        <p className="form-kicker">KHU VỰC QUẢN TRỊ</p>
        <h1>Đăng nhập</h1>
        <p className="form-intro">Quản lý các liên kết xuất hiện trên website.</p>
        <label>
          Tên đăng nhập
          <input
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
            required
            value={username}
          />
        </label>
        <label>
          Mật khẩu
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" disabled={submitting} type="submit">
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <a className="back-link" href="/">
          ← Trở về website
        </a>
      </form>
    </main>
  );
}

interface LinkFormProps {
  initialValue?: LinkItem;
  onCancel: () => void;
  onSave: (payload: LinkPayload) => Promise<void>;
}

function LinkForm({ initialValue, onCancel, onSave }: LinkFormProps) {
  const [form, setForm] = useState<LinkPayload>(
    initialValue
      ? {
          title: initialValue.title,
          url: initialValue.url,
          description: initialValue.description,
          category: initialValue.category,
          is_active: initialValue.is_active,
          sort_order: initialValue.sort_order,
        }
      : emptyLink,
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSave(form);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể lưu liên kết.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <p className="form-kicker">THÔNG TIN LIÊN KẾT</p>
          <h2>{initialValue ? "Chỉnh sửa liên kết" : "Thêm liên kết mới"}</h2>
        </div>
        <button className="icon-button" onClick={onCancel} type="button">
          ×
        </button>
      </div>
      <div className="form-grid">
        <label>
          Tiêu đề
          <input
            maxLength={120}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
            value={form.title}
          />
        </label>
        <label>
          Danh mục
          <input
            maxLength={80}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            required
            value={form.category}
          />
        </label>
        <label className="full-width">
          URL
          <input
            onChange={(event) => setForm({ ...form, url: event.target.value })}
            placeholder="https://example.com"
            required
            type="url"
            value={form.url}
          />
        </label>
        <label className="full-width">
          Mô tả
          <textarea
            maxLength={500}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            rows={4}
            value={form.description || ""}
          />
        </label>
        <label>
          Thứ tự
          <input
            min="0"
            onChange={(event) =>
              setForm({ ...form, sort_order: Number(event.target.value) })
            }
            type="number"
            value={form.sort_order}
          />
        </label>
        <label className="toggle-label">
          <input
            checked={form.is_active}
            onChange={(event) =>
              setForm({ ...form, is_active: event.target.checked })
            }
            type="checkbox"
          />
          Hiển thị công khai
        </label>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="form-actions">
        <button className="secondary-button" onClick={onCancel} type="button">
          Hủy
        </button>
        <button className="primary-button" disabled={submitting} type="submit">
          {submitting ? "Đang lưu..." : "Lưu liên kết"}
        </button>
      </div>
    </form>
  );
}

interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [editing, setEditing] = useState<LinkItem | "new" | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadLinks() {
    try {
      setLinks(await getAdminLinks());
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLinks();
  }, []);

  async function handleSave(payload: LinkPayload) {
    if (editing === "new") {
      await createLink(payload);
    } else if (editing) {
      await updateLink(editing.id, payload);
    }
    setEditing(null);
    await loadLinks();
  }

  async function handleDelete(link: LinkItem) {
    if (!window.confirm(`Xóa liên kết "${link.title}"?`)) {
      return;
    }
    try {
      await deleteLink(link.id);
      await loadLinks();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể xóa liên kết.");
    }
  }

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <a className="brand" href="/">
          HN<span>.</span>
        </a>
        <nav>
          <a className="active" href="#links">
            Liên kết
          </a>
          <a href="/" target="_blank">
            Xem website ↗
          </a>
        </nav>
        <button
          className="logout-button"
          onClick={() => {
            logout();
            onLogout();
          }}
          type="button"
        >
          Đăng xuất
        </button>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <p className="form-kicker">QUẢN LÝ NỘI DUNG</p>
            <h1>Liên kết</h1>
            <p>Thêm, chỉnh sửa và sắp xếp các liên kết công khai.</p>
          </div>
          <button className="primary-button" onClick={() => setEditing("new")}>
            + Thêm liên kết
          </button>
        </div>

        {error && <p className="dashboard-error">{error}</p>}
        {editing && (
          <LinkForm
            initialValue={editing === "new" ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSave={handleSave}
          />
        )}

        <div className="data-card">
          {loading ? (
            <p className="state-message">Đang tải dữ liệu...</p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Thứ tự</th>
                    <th>Liên kết</th>
                    <th>Danh mục</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id}>
                      <td>{link.sort_order}</td>
                      <td>
                        <strong>{link.title}</strong>
                        <a href={link.url} rel="noreferrer" target="_blank">
                          {link.url}
                        </a>
                      </td>
                      <td>{link.category}</td>
                      <td>
                        <span className={link.is_active ? "status on" : "status"}>
                          {link.is_active ? "Đang hiển thị" : "Đã ẩn"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button onClick={() => setEditing(link)}>Sửa</button>
                          <button
                            className="danger"
                            onClick={() => void handleDelete(link)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {links.length === 0 && (
                    <tr>
                      <td className="empty-table" colSpan={5}>
                        Chưa có liên kết nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  return authenticated ? (
    <Dashboard onLogout={() => setAuthenticated(false)} />
  ) : (
    <LoginForm onSuccess={() => setAuthenticated(true)} />
  );
}

export default function App() {
  return window.location.pathname.startsWith("/admin") ? (
    <AdminPage />
  ) : (
    <PublicPage />
  );
}
