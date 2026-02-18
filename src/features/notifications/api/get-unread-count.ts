import { api } from "@/lib/api-client";
import type { UnreadCountResponse } from "@/types/notification.types";

export const getUnreadCount = (): Promise<UnreadCountResponse> => {
  return api.get<UnreadCountResponse>("/notifications/unread-count", {
    requiresAuth: true,
  });
};
