import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadChapterPages } from "../api/upload-chapter-pages";

interface UploadChapterPagesParams {
  readonly mangaId: number;
  readonly chapterId: number;
  readonly files: File[];
}

export const useUploadChapterPages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UploadChapterPagesParams) =>
      uploadChapterPages(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter", variables.chapterId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chapters", "manga", variables.mangaId],
      });
    },
  });
};
