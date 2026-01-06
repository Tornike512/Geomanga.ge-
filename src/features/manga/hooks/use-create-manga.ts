import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MangaCreate } from "@/types/manga.types";
import { createManga } from "../api/create-manga";

export const useCreateManga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MangaCreate) => createManga(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga", "list"] });
    },
  });
};
