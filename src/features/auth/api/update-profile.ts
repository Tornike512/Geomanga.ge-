import { fetchApi } from "@/lib/api-client";
import type { User, UserUpdate } from "@/types/user.types";

export const updateProfile = async (userData: UserUpdate): Promise<User> => {
  const response = await fetchApi("/api/v1/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json() as Promise<User>;
};
