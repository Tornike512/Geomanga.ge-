import { api } from "@/lib/api-client";
import type { Notification } from "@/types/notification.types";

export const markRead = (notificationId: number): Promise<Notification> => {
  return api.patch<Notification>(
    `/notifications/${notificationId}/read`,
    undefined,
    { requiresAuth: true },
  );
};
