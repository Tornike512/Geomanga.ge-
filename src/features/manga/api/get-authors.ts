import { api } from "@/lib/api-client";

export const getAuthors = async (query?: string): Promise<string[]> => {
  return api.get<string[]>("/manga/authors", {
    params: { q: query || undefined, limit: 20 },
  });
};
