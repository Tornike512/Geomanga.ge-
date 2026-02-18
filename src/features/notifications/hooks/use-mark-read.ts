import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markRead } from "../api/mark-read";

export const useMarkRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
