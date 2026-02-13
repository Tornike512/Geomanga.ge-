import { api } from "@/lib/api-client";
import type { Tag } from "@/types/tag.types";

export const getTags = async (): Promise<Tag[]> => {
  return api.get<Tag[]>("/tags");
};
