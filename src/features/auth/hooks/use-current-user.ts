import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/get-current-user";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // HttpOnly cookies are automatically sent by browser, no need to check manually
  });
};
