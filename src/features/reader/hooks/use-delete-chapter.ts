import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChapter } from "../api/delete-chapter";

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chapterId: number) => deleteChapter(chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
};
