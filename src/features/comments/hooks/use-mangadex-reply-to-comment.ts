import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mangadexReplyToComment } from "../api/mangadex-reply-to-comment";

export const useMangadexReplyToComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => mangadexReplyToComment(commentId, content),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", "mangadex-chapter"],
        refetchType: "all",
      });
    },
  });
};
