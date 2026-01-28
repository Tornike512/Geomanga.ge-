import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRating } from "../api/delete-rating";

export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mangaId: number) => deleteRating(mangaId),
    onSuccess: async (_, mangaId) => {
      await queryClient.invalidateQueries({
        queryKey: ["ratings", "manga", mangaId],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["ratings", "user", mangaId],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["manga", "detail", mangaId],
        refetchType: "all",
      });
    },
  });
};
