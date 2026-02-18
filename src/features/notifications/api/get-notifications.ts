import { api } from "@/lib/api-client";
import type { NotificationListResponse } from "@/types/notification.types";

export interface GetNotificationsParams {
  page?: number;
  page_size?: number;
  unread_only?: boolean;
}

export const getNotifications = (
  params: GetNotificationsParams = {},
): Promise<NotificationListResponse> => {
  return api.get<NotificationListResponse>("/notifications", {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      unread_only: params.unread_only ?? false,
    },
    requiresAuth: true,
  });
};
