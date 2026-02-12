import { API_URL } from "@/config";
import { getCookie } from "@/utils/cookies";

interface UploadChapterPagesParams {
  readonly mangaId: number;
  readonly chapterId: number;
  readonly files: File[];
}

interface UploadChapterPagesResponse {
  readonly urls: string[];
  readonly filenames: string[];
  readonly count: number;
}

export const uploadChapterPages = async ({
  mangaId,
  chapterId,
  files,
}: UploadChapterPagesParams): Promise<UploadChapterPagesResponse> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const token = getCookie("access_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/upload/pages?manga_id=${mangaId}&chapter_id=${chapterId}`,
    {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: "Failed to upload chapter pages",
    }));
    const errorDetail =
      typeof error === "object" && error !== null && "detail" in error
        ? String(error.detail)
        : "Failed to upload chapter pages";
    throw new Error(errorDetail);
  }

  return response.json() as Promise<UploadChapterPagesResponse>;
};
