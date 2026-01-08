import { API_URL } from "@/config";
import { getCookie } from "@/utils/cookies";

export const uploadCover = async (
  file: File,
  mangaId: number,
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  // Get auth token
  const token = getCookie("access_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/upload/cover?manga_id=${mangaId}`, {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to upload cover image");
  }

  return response.json() as Promise<{ url: string }>;
};
