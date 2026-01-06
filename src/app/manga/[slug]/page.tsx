"use client";

import Link from "next/link";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { useCurrentUser } from "@/features/auth";
import {
  useAddBookmark,
  useBookmarks,
  useRemoveBookmark,
} from "@/features/library";
import { useMangaBySlug } from "@/features/manga";
import { useChaptersByManga } from "@/features/reader";
import { formatDate, formatNumber, formatRating } from "@/utils/formatters";
import { getCoverUrl } from "@/utils/image-urls";

export default function MangaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: manga, isLoading } = useMangaBySlug(params.slug);
  const { data: chapters } = useChaptersByManga(manga?.id || 0);

  const { data: user } = useCurrentUser();
  const { data: bookmarks } = useBookmarks();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const isBookmarked = bookmarks?.items.some((b) => b.manga_id === manga?.id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="space-y-4 md:col-span-2">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-bold text-2xl text-gray-900">Manga not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 grid gap-8 md:grid-cols-3">
        <div>
          <img
            src={getCoverUrl(manga.cover_image_url)}
            alt={manga.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="md:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 font-bold text-4xl">{manga.title}</h1>
              <div className="mb-4 flex items-center gap-2">
                <Badge>{manga.status}</Badge>
                {manga.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
            {user && (
              <Button
                variant={isBookmarked ? "default" : "outline"}
                onClick={() =>
                  isBookmarked
                    ? removeBookmark.mutate(manga.id)
                    : addBookmark.mutate({ manga_id: manga.id })
                }
              >
                {isBookmarked ? "❤️ Bookmarked" : "🤍 Bookmark"}
              </Button>
            )}
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="font-bold text-3xl text-blue-600">
                  {formatRating(manga.rating)}
                </div>
                <div className="text-gray-600 text-sm">Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="font-bold text-3xl text-green-600">
                  {formatNumber(manga.total_views)}
                </div>
                <div className="text-gray-600 text-sm">Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="font-bold text-3xl text-purple-600">
                  {chapters?.length || 0}
                </div>
                <div className="text-gray-600 text-sm">Chapters</div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 font-semibold text-xl">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {manga.description || "No description available."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {manga.author && (
              <div>
                <span className="font-semibold">Author:</span> {manga.author}
              </div>
            )}
            {manga.artist && (
              <div>
                <span className="font-semibold">Artist:</span> {manga.artist}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapters */}
      <section className="mb-12">
        <h2 className="mb-6 font-bold text-2xl">Chapters</h2>
        <div className="grid gap-2">
          {chapters?.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/read/${chapter.id}`}
              className="block rounded-lg border bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">
                    Chapter {chapter.chapter_number}
                  </span>
                  {chapter.title && (
                    <span className="ml-2 text-gray-600">
                      - {chapter.title}
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-sm">
                  {formatDate(chapter.release_date)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
