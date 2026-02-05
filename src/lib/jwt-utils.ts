import { decodeJwt } from "jose";
import type { UserRole } from "@/types/user.types";

export interface JWTPayload {
  sub: string; // user ID
  email?: string;
  role?: UserRole;
  exp?: number;
  iat?: number;
}

/**
 * Decode JWT token and extract payload
 * Note: This only decodes the token without verification.
 * The token is already validated by the backend.
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const payload = decodeJwt(token);
    return payload as JWTPayload;
  } catch {
    // Token is invalid or malformed, return null
    return null;
  }
}

/**
 * Extract user role from JWT token
 */
export function getUserRoleFromToken(token: string): UserRole | null {
  const payload = decodeToken(token);
  return payload?.role ?? null;
}

/**
 * Check if user has required role
 */
export function hasRequiredRole(
  token: string,
  requiredRoles: string[],
): boolean {
  const userRole = getUserRoleFromToken(token);
  if (!userRole) return false;

  return requiredRoles.includes(userRole);
}
