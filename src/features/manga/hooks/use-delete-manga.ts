import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteManga } from "../api/delete-manga";

export const useDeleteManga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mangaId: number) => deleteManga(mangaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga", "list"] });
    },
  });
};
