import { useQuery } from "@tanstack/react-query";
import {
  type GetNotificationsParams,
  getNotifications,
} from "../api/get-notifications";

export const useNotifications = (
  params: GetNotificationsParams = {},
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    enabled,
  });
};
