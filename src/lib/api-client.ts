/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { API_URL } from "@/config";
import { ApiError, type ApiErrorResponse } from "@/types/api.types";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies";
import { logger } from "@/utils/logger";

type ParamValue =
  | string
  | number
  | boolean
  | number[]
  | string[]
  | undefined
  | null;

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  cookie?: string;
  params?: Record<string, ParamValue>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  requiresAuth?: boolean;
};

export function buildUrlWithParams(
  url: string,
  params?: RequestOptions["params"],
): string {
  if (!params) return url;
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      // Handle arrays by adding multiple params with the same key
      for (const item of value) {
        searchParams.append(key, String(item));
      }
    } else {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  if (!queryString) return url;
  return `${url}?${queryString}`;
}

// Token management utilities
const TOKEN_STORAGE_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function getAccessToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return getCookie(TOKEN_STORAGE_KEY);
}

function getRefreshToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return getCookie(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;

  // Set access token to expire in 1 day
  setCookie(TOKEN_STORAGE_KEY, accessToken, 1);
  // Set refresh token to expire in 7 days
  setCookie(REFRESH_TOKEN_KEY, refreshToken, 7);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  deleteCookie(TOKEN_STORAGE_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
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

    const data = (await response.json()) as {
      access_token: string;
      refresh_token: string;
    };
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

export async function fetchApi<T>(
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
      errorResponse = (await response.json()) as ApiErrorResponse;
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
