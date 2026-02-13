import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MangadexReadingHistoryCreate } from "@/types/history.types";
import { trackMangadexReading } from "../api/track-mangadex-reading";

export const useTrackMangadexReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MangadexReadingHistoryCreate) =>
      trackMangadexReading(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mangadex-history"] });
    },
  });
};
