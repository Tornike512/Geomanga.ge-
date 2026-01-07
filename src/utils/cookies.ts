/**
 * Cookie utility functions
 *
 * Note: HttpOnly flag cannot be set via client-side JavaScript.
 * Only servers can set HttpOnly cookies via Set-Cookie response headers.
 *
 * The Cookie Store API is available but still cannot set HttpOnly cookies.
 * For simplicity and broader browser support, we use document.cookie.
 */

export function getCookie(name: string): string | undefined {
  if (typeof window === "undefined") return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }

  return undefined;
}

export function setCookie(name: string, value: string, days = 7): void {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Set cookie with security flags
  // - Secure: Only sent over HTTPS (enforced in production)
  // - SameSite=Strict: Prevents CSRF attacks
  // - HttpOnly: Cannot be set via JavaScript (server-only)
  const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
  document.cookie = cookieString;
}

export function deleteCookie(name: string): void {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
