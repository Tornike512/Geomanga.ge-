import { useMutation } from "@tanstack/react-query";
import { uploadCover } from "../api/upload-cover";

export const useUploadCover = () => {
  return useMutation({
    mutationFn: ({ file, mangaId }: { file: File; mangaId: number }) =>
      uploadCover(file, mangaId),
  });
};
