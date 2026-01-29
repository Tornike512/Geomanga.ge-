import { api } from "@/lib/api-client";
import type { PublicUserProfile } from "@/types/user.types";

export const getPublicProfile = async (
  userId: number,
): Promise<PublicUserProfile> => {
  return api.get<PublicUserProfile>(`/users/${userId}/profile`);
};
