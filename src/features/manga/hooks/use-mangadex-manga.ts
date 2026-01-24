import { useQuery } from "@tanstack/react-query";
import type { MangaDexListParams } from "@/types/mangadex.types";
import {
  getMangaDexLatest,
  getMangaDexManga,
  getMangaDexPopular,
  searchMangaDex,
} from "../api/get-mangadex-manga";

export const useMangaDexManga = (params: MangaDexListParams = {}) => {
  return useQuery({
    queryKey: ["mangadex", "manga", params],
    queryFn: () => getMangaDexManga(params),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useMangaDexPopular = () => {
  return useQuery({
    queryKey: ["mangadex", "popular"],
    queryFn: getMangaDexPopular,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useMangaDexLatest = () => {
  return useQuery({
    queryKey: ["mangadex", "latest"],
    queryFn: getMangaDexLatest,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useMangaDexSearch = (title: string) => {
  return useQuery({
    queryKey: ["mangadex", "search", title],
    queryFn: () => searchMangaDex(title),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: title.length >= 2, // Only search when at least 2 characters
  });
};
