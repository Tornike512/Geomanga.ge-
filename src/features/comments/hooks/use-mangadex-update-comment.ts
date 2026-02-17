import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mangadexUpdateComment } from "../api/mangadex-update-comment";

export const useMangadexUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => mangadexUpdateComment(commentId, content),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", "mangadex-chapter"],
        refetchType: "all",
      });
    },
  });
};
