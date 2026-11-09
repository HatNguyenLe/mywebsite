import type { LinkItem, LinkPayload } from "./types";

const TOKEN_KEY = "portfolio_admin_token";

interface ApiError {
  detail?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (authenticated) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("Bạn cần đăng nhập để tiếp tục.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, { ...options, headers });
  if (!response.ok) {
    let message = `Yêu cầu thất bại (${response.status})`;
    try {
      const body = (await response.json()) as ApiError;
      if (body.detail) {
        message = body.detail;
      }
    } catch {
      // The status code remains available when the server does not return JSON.
    }
    if (response.status === 401 && authenticated) {
      localStorage.removeItem(TOKEN_KEY);
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function getPublicLinks(): Promise<LinkItem[]> {
  return request<LinkItem[]>("/api/links");
}

export function getAdminLinks(): Promise<LinkItem[]> {
  return request<LinkItem[]>("/api/admin/links", {}, true);
}

export async function login(username: string, password: string): Promise<void> {
  const result = await request<{ access_token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem(TOKEN_KEY, result.access_token);
}

export function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function createLink(payload: LinkPayload): Promise<LinkItem> {
  return request<LinkItem>(
    "/api/admin/links",
    { method: "POST", body: JSON.stringify(payload) },
    true,
  );
}

export function updateLink(
  id: number,
  payload: LinkPayload,
): Promise<LinkItem> {
  return request<LinkItem>(
    `/api/admin/links/${id}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    true,
  );
}

export function deleteLink(id: number): Promise<void> {
  return request<void>(
    `/api/admin/links/${id}`,
    { method: "DELETE" },
    true,
  );
}

