const API_STATIC_URL =
  process.env.NEXT_PUBLIC_STATIC_URL || "http://localhost:8000/uploads";

export const uploadChapterPages = async (
  files: File[],
): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(
    `${API_STATIC_URL}/../api/v1/upload/chapter-pages`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to upload chapter pages");
  }

  return response.json() as Promise<{ urls: string[] }>;
};
