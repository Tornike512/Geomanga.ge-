import { api } from "@/lib/api-client";

export const markAllRead = (): Promise<void> => {
  return api.patch<void>("/notifications/read-all", undefined, {
    requiresAuth: true,
  });
};
