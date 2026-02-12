import { API_URL } from "@/config";
import { getCookie } from "@/utils/cookies";

export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  // Validate file size (5MB max)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 5MB");
  }

  // Validate file type
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WebP images are allowed");
  }

  const formData = new FormData();
  formData.append("file", file);

  const token = getCookie("access_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/upload/avatar`, {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(
      errorData.message || `Failed to upload avatar: ${response.statusText}`,
    );
  }

  return response.json() as Promise<{ url: string }>;
};
