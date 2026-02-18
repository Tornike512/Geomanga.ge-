import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllRead } from "../api/mark-all-read";

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
