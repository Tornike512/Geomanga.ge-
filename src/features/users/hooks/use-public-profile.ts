import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "../api/get-public-profile";

export const usePublicProfile = (userId: number) => {
  return useQuery({
    queryKey: ["users", "profile", userId],
    queryFn: () => getPublicProfile(userId),
    enabled: userId > 0,
  });
};
