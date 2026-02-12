import { API_URL } from "@/config";
import { getCookie } from "@/utils/cookies";

interface UploadChapterPagesParams {
  readonly mangaId: number;
  readonly chapterId: number;
  readonly files: File[];
  readonly onProgress?: (progress: number) => void;
}

interface UploadChapterPagesResponse {
  readonly urls: string[];
  readonly filenames: string[];
  readonly count: number;
}

/**
 * Uploads chapter pages with progress tracking
 */
export const uploadChapterPagesWithProgress = ({
  mangaId,
  chapterId,
  files,
  onProgress,
}: UploadChapterPagesParams): Promise<UploadChapterPagesResponse> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status === 201 || xhr.status === 200) {
        try {
          const response = JSON.parse(
            xhr.response,
          ) as UploadChapterPagesResponse;
          resolve(response);
        } catch {
          reject(new Error("Failed to parse response"));
        }
      } else {
        try {
          const error = JSON.parse(xhr.response);
          const errorDetail =
            typeof error === "object" && error !== null && "detail" in error
              ? String(error.detail)
              : "Upload failed";
          reject(new Error(errorDetail));
        } catch {
          reject(new Error("Upload failed"));
        }
      }
    });

    // Handle network errors
    xhr.addEventListener("error", () => {
      reject(new Error("ქსელის შეცდომა. სცადეთ თავიდან."));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("ატვირთვა გაუქმდა"));
    });

    // Open connection and send
    xhr.open(
      "POST",
      `${API_URL}/upload/pages?manga_id=${mangaId}&chapter_id=${chapterId}`,
    );
    xhr.withCredentials = true;
    const token = getCookie("access_token");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.send(formData);
  });
};

/**
 * Retry upload with exponential backoff
 */
export async function uploadWithRetry(
  params: UploadChapterPagesParams,
  maxRetries = 3,
): Promise<UploadChapterPagesResponse> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadChapterPagesWithProgress(params);
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = 1000 * 2 ** (attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Upload failed after retries");
}
