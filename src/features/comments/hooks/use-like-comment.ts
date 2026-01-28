import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeComment } from "../api/like-comment";

export const useToggleLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => toggleLikeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

/**
 * @deprecated Use useToggleLikeComment instead. The API now uses a toggle approach.
 */
export const useLikeComment = useToggleLikeComment;
