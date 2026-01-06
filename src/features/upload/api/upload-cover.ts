const API_STATIC_URL =
  process.env.NEXT_PUBLIC_STATIC_URL || "http://localhost:8000/uploads";

export const uploadCover = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_STATIC_URL}/../api/v1/upload/cover`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to upload cover image");
  }

  return response.json() as Promise<{ url: string }>;
};
