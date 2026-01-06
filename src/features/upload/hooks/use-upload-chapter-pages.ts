import { useMutation } from "@tanstack/react-query";
import { uploadChapterPages } from "../api/upload-chapter-pages";

export const useUploadChapterPages = () => {
  return useMutation({
    mutationFn: (files: File[]) => uploadChapterPages(files),
  });
};
