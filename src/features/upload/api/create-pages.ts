import { api } from "@/lib/api-client";
import type { BulkPageCreate, Page } from "@/types/page.types";

export const createPages = async (data: BulkPageCreate): Promise<Page[]> => {
  return api.post<Page[]>("/pages/bulk", data, { requiresAuth: true });
};
