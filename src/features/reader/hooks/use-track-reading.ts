import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReadingHistoryCreate } from "@/types/history.types";
import { trackReading } from "../api/track-reading";

export const useTrackReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReadingHistoryCreate) => trackReading(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga", "slug"] });
    },
  });
};
