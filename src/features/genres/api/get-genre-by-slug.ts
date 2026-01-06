import { api } from "@/lib/api-client";
import type { Genre } from "@/types/genre.types";

export const getGenreBySlug = async (slug: string): Promise<Genre> => {
  return api.get<Genre>(`/genres/slug/${slug}`);
};
