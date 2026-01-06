import { api } from "@/lib/api-client";
import type { Genre } from "@/types/genre.types";

export const getGenres = async (): Promise<Genre[]> => {
  return api.get<Genre[]>("/genres");
};
