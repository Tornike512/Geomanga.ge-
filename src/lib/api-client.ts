/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { API_URL } from "@/config";
import { ApiError, type ApiErrorResponse } from "@/types/api.types";
import { logger } from "@/utils/logger";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  cookie?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  requiresAuth?: boolean;
};

function buildUrlWithParams(
  url: string,
  params?: RequestOptions["params"],
): string {
  if (!params) return url;
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  );
  if (Object.keys(filteredParams).length === 0) return url;
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>,
  ).toString();
  return `${url}?${queryString}`;
}

// Token management utilities
const TOKEN_STORAGE_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function getAccessToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(TOKEN_STORAGE_KEY) ?? undefined;
}

function getRefreshToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(REFRESH_TOKEN_KEY) ?? undefined;
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken(): Promise<string | undefined> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return undefined;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return undefined;
    }

    const data = await response.json();
    setTokens(data.access_token, data.refresh_token);
    return data.access_token;
  } catch (error) {
    logger.error("Failed to refresh token:", error);
    clearTokens();
    return undefined;
  }
}

// Create a separate function for getting server-side cookies that can be imported where needed
export function getServerCookies() {
  if (typeof window !== "undefined") return "";

  // Dynamic import next/headers only on server-side
  return import("next/headers").then(async ({ cookies }) => {
    try {
      const cookieStore = await cookies();
      return cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    } catch (error) {
      logger.error("Failed to get server cookies:", error);
      return "";
    }
  });
}

async function fetchApi<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    cookie,
    params,
    cache = "no-store",
    next,
    requiresAuth = false,
  } = options;

  // Get cookies from the request when running on server
  let cookieHeader = cookie;
  if (typeof window === "undefined" && !cookie) {
    cookieHeader = await getServerCookies();
  }

  const fullUrl = buildUrlWithParams(`${API_URL}${url}`, params);

  // Add authorization header if auth is required (client-side only)
  const authHeaders: Record<string, string> = {};
  if (requiresAuth && typeof window !== "undefined") {
    const token = getAccessToken();
    if (token) {
      authHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let response = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
      ...authHeaders,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    cache,
    next,
  });

  // Handle 401 - try to refresh token (client-side only)
  if (
    response.status === 401 &&
    requiresAuth &&
    typeof window !== "undefined"
  ) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      authHeaders.Authorization = `Bearer ${newToken}`;
      response = await fetch(fullUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
          ...authHeaders,
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
        cache,
        next,
      });
    }
  }

  if (!response.ok) {
    let errorResponse: ApiErrorResponse | undefined;
    try {
      errorResponse = await response.json();
    } catch {
      // If parsing fails, continue without error details
    }

    const message = errorResponse?.detail ?? response.statusText;
    throw new ApiError(message, response.status, errorResponse);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "GET" });
  },
  post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "POST", body });
  },
  put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "PUT", body });
  },
  patch<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "PATCH", body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "DELETE" });
  },
};
