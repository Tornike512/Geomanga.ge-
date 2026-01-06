"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Marquee from "react-fast-marquee";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
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

export default function MangaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: manga, isLoading } = useMangaBySlug(slug);
  const { data: chapters } = useChaptersByManga(manga?.id || 0);

  const { data: user } = useCurrentUser();
  const { data: bookmarks } = useBookmarks();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const isBookmarked = bookmarks?.items.some((b) => b.manga_id === manga?.id);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-6 py-24 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="space-y-6 md:col-span-2">
            <Skeleton className="h-16 w-3/4 rounded-lg" />
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-6 w-2/3 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="container mx-auto max-w-6xl px-6 py-24 text-center md:px-8">
        <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
          Manga not found
        </h1>
        <p className="mt-4 text-[var(--muted-foreground)] text-lg">
          The manga you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero Section with Cover and Title */}
      <section className="border-[var(--border)] border-b py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Cover Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-xl border border-[var(--border)] shadow-[0_10px_15px_rgba(0,0,0,0.3)]">
                <Image
                  src={getCoverUrl(manga.cover_image_url)}
                  alt={manga.title}
                  width={400}
                  height={600}
                  className="w-full transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Title and Metadata */}
            <div className="md:col-span-2">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  {/* Title */}
                  <h1 className="mb-4 font-semibold text-2xl tracking-tight sm:text-3xl md:text-4xl">
                    {manga.title}
                  </h1>

                  {/* Badges */}
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{manga.status}</Badge>
                    {manga.genres.map((genre) => (
                      <Badge key={genre.id}>{genre.name}</Badge>
                    ))}
                  </div>
                </div>

                {/* Bookmark Button */}
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

              {/* Stats Cards with Glass Effect */}
              <div className="mb-8 grid gap-3 md:grid-cols-3">
                <Card className="p-6 text-center">
                  <div className="mb-1 font-semibold text-3xl text-[var(--accent)]">
                    {formatRating(manga.rating)}
                  </div>
                  <div className="text-[var(--muted-foreground)] text-xs uppercase tracking-wide">
                    Rating
                  </div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="mb-1 font-semibold text-3xl text-[var(--accent)]">
                    {formatNumber(manga.total_views)}
                  </div>
                  <div className="text-[var(--muted-foreground)] text-xs uppercase tracking-wide">
                    Views
                  </div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="mb-1 font-semibold text-3xl text-[var(--accent)]">
                    {chapters?.length || 0}
                  </div>
                  <div className="text-[var(--muted-foreground)] text-xs uppercase tracking-wide">
                    Chapters
                  </div>
                </Card>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="mb-3 font-medium text-base">Description</h2>
                <p className="max-w-3xl text-[var(--muted-foreground)] text-sm leading-relaxed">
                  {manga.description || "No description available."}
                </p>
              </div>

              {/* Author/Artist Grid */}
              <div className="grid gap-3 md:grid-cols-2">
                {manga.author && (
                  <div className="border-[var(--accent)]/50 border-l-2 pl-3">
                    <div className="text-[var(--muted-foreground)] text-xs">
                      Author
                    </div>
                    <div className="font-medium text-sm">{manga.author}</div>
                  </div>
                )}
                {manga.artist && (
                  <div className="border-[var(--accent)]/50 border-l-2 pl-3">
                    <div className="text-[var(--muted-foreground)] text-xs">
                      Artist
                    </div>
                    <div className="font-medium text-sm">{manga.artist}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Marquee - Subtle amber accent */}
      <section className="border-[var(--border)] border-b bg-[var(--accent)] py-4">
        <Marquee speed={80} gradient={false} className="overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={`marquee-stat-${i}-${manga.id}`}
              className="mx-8 flex items-center gap-4"
            >
              <div className="flex items-center gap-1">
                <span className="font-semibold text-2xl text-[var(--accent-foreground)]">
                  {formatRating(manga.rating)}
                </span>
                <Star className="h-6 w-6 fill-[var(--accent-foreground)] text-[var(--accent-foreground)]" />
              </div>
              <span className="text-[var(--accent-foreground)]/80 text-sm">
                Rating
              </span>
              <span className="text-2xl text-[var(--accent-foreground)]/40">
                •
              </span>
              <span className="font-semibold text-2xl text-[var(--accent-foreground)]">
                {formatNumber(manga.total_views)}
              </span>
              <span className="text-[var(--accent-foreground)]/80 text-sm">
                Total Views
              </span>
              <span className="text-2xl text-[var(--accent-foreground)]/40">
                •
              </span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* Chapters Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          {/* Section Title */}
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
              Chapters
            </h2>
            <div className="text-[var(--muted-foreground)] text-sm">
              {chapters?.length || 0} total
            </div>
          </div>

          {/* Chapter List - Glass Cards */}
          <div className="space-y-2">
            {chapters?.map((chapter, _index) => (
              <Link
                key={chapter.id}
                href={`/read/${chapter.id}`}
                className="group block rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[rgba(26,26,36,0.8)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-[var(--foreground)] text-base group-hover:text-[var(--accent)]">
                      Chapter {chapter.chapter_number}
                    </div>
                    {chapter.title && (
                      <div className="text-[var(--muted-foreground)] text-sm">
                        {chapter.title}
                      </div>
                    )}
                  </div>
                  <div className="text-[var(--muted-foreground)] text-xs">
                    {formatDate(chapter.release_date)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
