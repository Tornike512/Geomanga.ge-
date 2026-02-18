import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../api/get-unread-count";

export const useUnreadCount = (enabled: boolean) => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 30_000,
    enabled,
  });
};
