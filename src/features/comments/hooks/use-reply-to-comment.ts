import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToComment } from "../api/reply-to-comment";

export const useReplyToComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => replyToComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};
