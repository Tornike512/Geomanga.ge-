import { api, clearTokens } from "@/lib/api-client";

export const logout = async (): Promise<void> => {
  // Call backend logout endpoint to clear HttpOnly cookies
  try {
    await api.post("/auth/logout", undefined, { requiresAuth: true });
  } catch {
    // Even if backend call fails, clear local cookies
  }

  // Clear any non-HttpOnly cookies set client-side
  clearTokens();
};
