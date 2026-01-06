import { useMutation } from "@tanstack/react-query";
import type { ReadingHistoryCreate } from "@/types/history.types";
import { trackReading } from "../api/track-reading";

export const useTrackReading = () => {
  return useMutation({
    mutationFn: (data: ReadingHistoryCreate) => trackReading(data),
  });
};
