import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  getCookie,
  setCookie,
  removeCookie,
} from "@/lib/cookies";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

let isRefreshing = false;

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const res = await fetchWithAuth(endpoint, options);

  if (res.ok) return res.json() as Promise<T>;

  if (res.status === 401 && !endpoint.includes("/refresh-token")) {
    const refreshed = await silentRefresh();
    if (refreshed) {
      const retry = await fetchWithAuth(endpoint, options);
      if (retry.ok) return retry.json() as Promise<T>;
    }

    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
    window.location.href = "/login";
  }
  const error = await res.json().catch(() => ({ message: res.statusText }));
  throw new Error(error.message ?? "Something went wrong");
}

function fetchWithAuth(endpoint: string, options: RequestOptions) {
  const token = getCookie(ACCESS_TOKEN_KEY);
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"] && options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: isFormData
      ? (options.body as FormData)
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });
}

async function silentRefresh(): Promise<boolean> {
  if (isRefreshing) return false;
  isRefreshing = true;

  try {
    const refreshToken = getCookie(REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    const res = await fetch(`${BASE_URL}/v1/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    setCookie(ACCESS_TOKEN_KEY, data.accessToken);
    setCookie(REFRESH_TOKEN_KEY, data.refreshToken);
    return true;
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
}
