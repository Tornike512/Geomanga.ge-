import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RatingCreate } from "@/types/rating.types";
import { submitRating } from "../api/submit-rating";

export const useSubmitRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RatingCreate) => submitRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", "manga", variables.manga_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["ratings", "user", variables.manga_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["manga", "detail", variables.manga_id],
      });
    },
  });
};
