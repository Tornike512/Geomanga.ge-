import { api } from "@/lib/api-client";

export const deleteChapter = async (
  chapterId: number,
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(`/chapters/${chapterId}`, {
    requiresAuth: true,
  });
};
