import { clearTokens } from "@/lib/api-client";

export const logout = async (): Promise<void> => {
  // Clear tokens from local storage
  clearTokens();

  // Optionally call backend logout endpoint if you add one later
  // await api.post("/auth/logout", undefined, { requiresAuth: true });
};
