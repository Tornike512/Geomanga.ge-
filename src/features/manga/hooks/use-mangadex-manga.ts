import { useQuery } from "@tanstack/react-query";
import type {
  MangaDexBrowseParams,
  MangaDexListParams,
} from "@/types/mangadex.types";
import {
  browseMangaDex,
  getMangaDexAvailableLanguages,
  getMangaDexChapterPages,
  getMangaDexChapters,
  getMangaDexLatest,
  getMangaDexManga,
  getMangaDexMangaById,
  getMangaDexPopular,
  getMangaDexTags,
  searchMangaDex,
} from "../api/get-mangadex-manga";

export const useMangaDexManga = (params: MangaDexListParams = {}) => {
  return useQuery({
    queryKey: ["mangadex", "manga", params],
    queryFn: () => getMangaDexManga(params),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useMangaDexPopular = (language?: string) => {
  return useQuery({
    queryKey: ["mangadex", "popular", language],
    queryFn: () => getMangaDexPopular(language),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useMangaDexLatest = (language?: string) => {
  return useQuery({
    queryKey: ["mangadex", "latest", language],
    queryFn: () => getMangaDexLatest(language),
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

export const useMangaDexBrowse = (params: MangaDexBrowseParams = {}) => {
  return useQuery({
    queryKey: ["mangadex", "browse", params],
    queryFn: () => browseMangaDex(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMangaDexTags = () => {
  return useQuery({
    queryKey: ["mangadex", "tags"],
    queryFn: getMangaDexTags,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useMangaDexMangaById = (mangaId: string) => {
  return useQuery({
    queryKey: ["mangadex", "manga", mangaId],
    queryFn: () => getMangaDexMangaById(mangaId),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!mangaId,
  });
};

export const useMangaDexChapters = (mangaId: string, language = "en") => {
  return useQuery({
    queryKey: ["mangadex", "chapters", mangaId, language],
    queryFn: () => getMangaDexChapters(mangaId, language),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!mangaId,
  });
};

export const useMangaDexChapterPages = (chapterId: string) => {
  return useQuery({
    queryKey: ["mangadex", "chapter-pages", chapterId],
    queryFn: () => getMangaDexChapterPages(chapterId),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!chapterId,
  });
};

export const useMangaDexAvailableLanguages = (mangaId: string) => {
  return useQuery({
    queryKey: ["mangadex", "available-languages", mangaId],
    queryFn: () => getMangaDexAvailableLanguages(mangaId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!mangaId,
  });
};
