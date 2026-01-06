"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Marquee from "react-fast-marquee";
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
      <div className="container mx-auto max-w-[95vw] px-8 py-20">
        <div className="grid gap-12 md:grid-cols-3">
          <Skeleton className="aspect-[3/4] w-full rounded-none" />
          <div className="space-y-8 md:col-span-2">
            <Skeleton className="h-24 w-3/4 rounded-none" />
            <Skeleton className="h-8 w-full rounded-none" />
            <Skeleton className="h-8 w-full rounded-none" />
            <Skeleton className="h-8 w-2/3 rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="container mx-auto max-w-[95vw] px-8 py-32 text-center">
        <h1 className="font-bold text-[clamp(3rem,10vw,8rem)] uppercase leading-none tracking-tighter">
          MANGA NOT FOUND
        </h1>
        <p className="mt-8 text-[#A1A1AA] text-xl">
          The manga you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero Section with Cover and Title */}
      <section className="border-[#3F3F46] border-b-2 py-20 md:py-32">
        <div className="container mx-auto max-w-[95vw] px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Cover Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-none border-2 border-[#3F3F46]">
                <Image
                  src={getCoverUrl(manga.cover_image_url)}
                  alt={manga.title}
                  width={400}
                  height={600}
                  className="w-full transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
              {/* Decorative Background Number */}
              <div
                className="-right-12 -top-12 -z-10 pointer-events-none absolute font-bold text-[#27272A] text-[12rem] leading-none"
                aria-hidden="true"
              >
                {formatRating(manga.rating)}
              </div>
            </div>

            {/* Title and Metadata */}
            <div className="md:col-span-2">
              <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  {/* Massive Title */}
                  <h1 className="mb-6 font-bold text-[clamp(2.5rem,8vw,6rem)] uppercase leading-[0.9] tracking-tighter">
                    {manga.title}
                  </h1>

                  {/* Badges */}
                  <div className="mb-6 flex flex-wrap items-center gap-3">
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
                    {isBookmarked ? "❤️ BOOKMARKED" : "🤍 BOOKMARK"}
                  </Button>
                )}
              </div>

              {/* Stats Cards with Hover Effects */}
              <div className="mb-12 grid gap-px bg-[#3F3F46] md:grid-cols-3">
                <Card className="rounded-none border-0">
                  <CardContent className="pt-8 text-center">
                    <div className="mb-2 font-bold text-[#DFE104] text-[6rem] leading-none">
                      {formatRating(manga.rating)}
                    </div>
                    <div className="text-[#A1A1AA] text-sm uppercase tracking-widest group-hover:text-[#000000]">
                      RATING
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-none border-0">
                  <CardContent className="pt-8 text-center">
                    <div className="mb-2 font-bold text-[#DFE104] text-[6rem] leading-none">
                      {formatNumber(manga.total_views)}
                    </div>
                    <div className="text-[#A1A1AA] text-sm uppercase tracking-widest group-hover:text-[#000000]">
                      VIEWS
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-none border-0">
                  <CardContent className="pt-8 text-center">
                    <div className="mb-2 font-bold text-[#DFE104] text-[6rem] leading-none">
                      {chapters?.length || 0}
                    </div>
                    <div className="text-[#A1A1AA] text-sm uppercase tracking-widest group-hover:text-[#000000]">
                      CHAPTERS
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="mb-4 font-bold text-2xl uppercase tracking-tight">
                  DESCRIPTION
                </h2>
                <p className="max-w-3xl text-[#A1A1AA] text-xl leading-tight">
                  {manga.description || "No description available."}
                </p>
              </div>

              {/* Author/Artist Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {manga.author && (
                  <div className="border-[#DFE104] border-l-4 pl-4">
                    <div className="text-[#A1A1AA] text-sm uppercase tracking-widest">
                      AUTHOR
                    </div>
                    <div className="font-bold text-xl">{manga.author}</div>
                  </div>
                )}
                {manga.artist && (
                  <div className="border-[#DFE104] border-l-4 pl-4">
                    <div className="text-[#A1A1AA] text-sm uppercase tracking-widest">
                      ARTIST
                    </div>
                    <div className="font-bold text-xl">{manga.artist}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Marquee - Kinetic Energy */}
      <section className="border-[#3F3F46] border-b-2 bg-[#DFE104] py-8">
        <Marquee speed={80} gradient={false} className="overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={`marquee-stat-${i}-${manga.id}`}
              className="mx-12 flex items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-6xl text-[#000000]">
                  {formatRating(manga.rating)}
                </span>
                <Star className="h-12 w-12 fill-[#000000] text-[#000000]" />
              </div>
              <span className="text-2xl text-[#000000] uppercase tracking-wider">
                RATING
              </span>
              <span className="text-6xl text-[#000000]">•</span>
              <span className="font-bold text-6xl text-[#000000]">
                {formatNumber(manga.total_views)}
              </span>
              <span className="text-2xl text-[#000000] uppercase tracking-wider">
                TOTAL VIEWS
              </span>
              <span className="text-6xl text-[#000000]">•</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* Chapters Section */}
      <section className="border-[#3F3F46] border-b-2 py-20 md:py-32">
        <div className="container mx-auto max-w-[95vw] px-8">
          {/* Section Title */}
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-bold text-[clamp(2rem,6vw,4rem)] uppercase leading-none tracking-tighter">
              CHAPTERS
            </h2>
            <div
              className="font-bold text-[#27272A] text-[8rem] leading-none"
              aria-hidden="true"
            >
              {chapters?.length || 0}
            </div>
          </div>

          {/* Chapter List - Brutalist Cards */}
          <div className="grid gap-px bg-[#3F3F46]">
            {chapters?.map((chapter, _index) => (
              <Link
                key={chapter.id}
                href={`/read/${chapter.id}`}
                className="group relative block border-2 border-transparent bg-[#09090B] p-8 transition-all duration-300 hover:border-[#DFE104] hover:bg-[#DFE104]"
              >
                {/* Chapter Number (Decorative) */}
                <div
                  className="-right-4 -top-4 pointer-events-none absolute font-bold text-[#27272A] text-[6rem] leading-none opacity-50 group-hover:text-[#000000] group-hover:opacity-20"
                  aria-hidden="true"
                >
                  {String(chapter.chapter_number).padStart(2, "0")}
                </div>

                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 font-bold text-3xl text-[#FAFAFA] uppercase tracking-tighter group-hover:text-[#000000]">
                      CHAPTER {chapter.chapter_number}
                    </div>
                    {chapter.title && (
                      <div className="text-[#A1A1AA] text-xl group-hover:text-[#000000] group-hover:opacity-80">
                        {chapter.title}
                      </div>
                    )}
                  </div>
                  <div className="text-[#A1A1AA] text-sm uppercase tracking-widest group-hover:text-[#000000]">
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
