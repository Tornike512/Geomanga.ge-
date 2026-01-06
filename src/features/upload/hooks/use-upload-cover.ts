import { useMutation } from "@tanstack/react-query";
import { uploadCover } from "../api/upload-cover";

export const useUploadCover = () => {
  return useMutation({
    mutationFn: (file: File) => uploadCover(file),
  });
};
