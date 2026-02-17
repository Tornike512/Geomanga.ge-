import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mangadexToggleLikeComment } from "../api/mangadex-like-comment";

export const useMangadexToggleLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => mangadexToggleLikeComment(commentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", "mangadex-chapter"],
        refetchType: "all",
      });
    },
  });
};
