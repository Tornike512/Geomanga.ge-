import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mangadexDeleteComment } from "../api/mangadex-delete-comment";

export const useMangadexDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => mangadexDeleteComment(commentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", "mangadex-chapter"],
        refetchType: "all",
      });
    },
  });
};
