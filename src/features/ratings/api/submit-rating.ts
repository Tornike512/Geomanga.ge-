import { api } from "@/lib/api-client";
import type { Rating, RatingCreate } from "@/types/rating.types";

export const submitRating = async (data: RatingCreate): Promise<Rating> => {
  return api.post<Rating>("/ratings", data, { requiresAuth: true });
};
