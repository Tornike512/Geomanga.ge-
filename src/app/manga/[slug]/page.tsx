"use client";

import { Globe, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Dropdown } from "@/components/dropdown";
import { Spinner } from "@/components/spinner";
import { useCurrentUser } from "@/features/auth";
import {
  useAddBookmark,
  useBookmarks,
  useRemoveBookmark,
} from "@/features/library";
import {
  useMangaBySlug,
  useMangaDexChapters,
  useMangaDexMangaById,
} from "@/features/manga";
import { useChaptersByManga } from "@/features/reader";
import { UserRole } from "@/types/user.types";
import { formatDate, formatNumber, formatRating } from "@/utils/formatters";
import { getCoverUrl } from "@/utils/image-urls";

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "zh", label: "中文" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "pt-br", label: "Português (BR)" },
  { value: "ru", label: "Русский" },
];

export default function MangaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Check if this is a MangaDex manga (slug starts with "md-")
  const isMangaDex = slug.startsWith("md-");
  const mangaDexId = isMangaDex ? slug.slice(3) : null;

  // Local manga data
  const { data: localManga, isLoading: localLoading } = useMangaBySlug(slug);
  const { data: localChapters } = useChaptersByManga(localManga?.id || 0);

  // MangaDex manga data
  const { data: mangaDexManga, isLoading: mangaDexLoading } =
    useMangaDexMangaById(mangaDexId || "");
  const { data: mangaDexChapters, isLoading: chaptersLoading } =
    useMangaDexChapters(mangaDexId || "", selectedLanguage);

  const { data: user } = useCurrentUser();
  const { data: bookmarks } = useBookmarks();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const isBookmarked = bookmarks?.items.some(
    (b) => b.manga_id === localManga?.id,
  );

  const isLoading = isMangaDex ? mangaDexLoading : localLoading;
  const manga = isMangaDex ? mangaDexManga : localManga;
  const chapters = isMangaDex ? mangaDexChapters : localChapters;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="container mx-auto max-w-[1920px] px-6 py-12 text-center md:px-8">
        <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
          მანგა ვერ მოიძებნა
        </h1>
        <p className="mt-4 text-[var(--muted-foreground)] text-lg">
          მანგა, რომელსაც ეძებთ, არ არსებობს.
        </p>
      </div>
    );
  }

  // Get cover URL based on source
  const coverUrl = isMangaDex
    ? mangaDexManga?.cover_image_url
    : getCoverUrl(localManga?.cover_image_url);

  // Get genres/tags
  const genres = isMangaDex
    ? mangaDexManga?.tags.map((t) => ({ id: t.id, name: t.name })) || []
    : localManga?.genres || [];

  return (
    <div className="relative">
      {/* Hero Section with Cover and Title */}
      <section className="border-[var(--border)] border-b py-8 md:py-8">
        <div className="container mx-auto max-w-[1920px] px-6 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Cover Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-xl border border-[var(--border)] shadow-[0_10px_15px_rgba(0,0,0,0.3)]">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={manga.title}
                    width={400}
                    height={600}
                    className="w-full"
                    priority
                    unoptimized={isMangaDex}
                  />
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center bg-[var(--muted)]">
                    <span className="text-[var(--muted-foreground)]">
                      No Cover
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Title and Metadata */}
            <div className="md:col-span-2">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  {/* MangaDex Badge */}
                  {isMangaDex && (
                    <div className="mb-2">
                      <Badge variant="secondary" className="gap-1">
                        <Globe className="h-3 w-3" />
                        MangaDex
                      </Badge>
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="mb-4 font-semibold text-2xl tracking-tight sm:text-3xl md:text-4xl">
                    {manga.title}
                  </h1>

                  {/* Badges */}
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{manga.status}</Badge>
                    {genres.slice(0, 5).map((genre) => (
                      <Badge key={genre.id}>{genre.name}</Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 sm:flex-row">
                  {!isMangaDex &&
                    user &&
                    (user.role === UserRole.UPLOADER ||
                      user.role === UserRole.ADMIN) && (
                      <Link href={`/upload/chapter?mangaId=${localManga?.id}`}>
                        <Button variant="outline">
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            role="img"
                            aria-label="დამატება"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          თავის დამატება
                        </Button>
                      </Link>
                    )}
                  {!isMangaDex && user && (
                    <Button
                      variant={isBookmarked ? "default" : "outline"}
                      onClick={() =>
                        isBookmarked
                          ? removeBookmark.mutate(localManga?.id)
                          : addBookmark.mutate({ manga_id: localManga?.id })
                      }
                    >
                      {isBookmarked ? "❤️ სანიშნებშია" : "🤍 სანიშნებში"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats Cards with Glass Effect */}
              <div className="mb-8 grid gap-3 md:grid-cols-3">
                {!isMangaDex && (
                  <>
                    <Card className="p-6 text-center">
                      <div className="mb-1 font-semibold text-3xl text-[var(--accent)]">
                        {formatRating(localManga?.rating || 0)}
                      </div>
                      <div className="text-[var(--muted-foreground)] text-xs uppercase tracking-wide">
                        რეიტინგი
                      </div>
                    </Card>
                    <Card className="p-6 text-center">
                      <div className="mb-1 font-semibold text-3xl text-[var(--accent)]">
                        {formatNumber(localManga?.total_views || 0)}
                      </div>
                      <div className="text-[var(--muted-foreground)] text-xs uppercase tracking-wide">
                        ნახვები
                      </div>
                    </Card>
                  </>
                )}
                <Card
                  className={`p-6 text-center ${isMangaDex ? "md:col-span-3" : ""}`}
                >
                  <div className="mb-1 font-semibold text-3xl text-[var(--accent)]">
                    {chapters?.length || 0}
                  </div>
                  <div className="text-[var(--muted-foreground)] text-xs uppercase tracking-wide">
                    თავები {isMangaDex && `(${selectedLanguage.toUpperCase()})`}
                  </div>
                </Card>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="mb-3 font-medium text-base">აღწერა</h2>
                <p className="max-w-3xl text-[var(--muted-foreground)] text-sm leading-relaxed">
                  {manga.description || "აღწერა არ არის ხელმისაწვდომი."}
                </p>
              </div>

              {/* Author/Artist Grid */}
              <div className="grid gap-3 md:grid-cols-2">
                {manga.author && (
                  <div className="border-[var(--accent)]/50 border-l-2 pl-3">
                    <div className="text-[var(--muted-foreground)] text-xs">
                      ავტორი
                    </div>
                    <div className="font-medium text-sm">{manga.author}</div>
                  </div>
                )}
                {manga.artist && (
                  <div className="border-[var(--accent)]/50 border-l-2 pl-3">
                    <div className="text-[var(--muted-foreground)] text-xs">
                      მხატვარი
                    </div>
                    <div className="font-medium text-sm">{manga.artist}</div>
                  </div>
                )}
                {isMangaDex && mangaDexManga?.year && (
                  <div className="border-[var(--accent)]/50 border-l-2 pl-3">
                    <div className="text-[var(--muted-foreground)] text-xs">
                      წელი
                    </div>
                    <div className="font-medium text-sm">
                      {mangaDexManga.year}
                    </div>
                  </div>
                )}
                {isMangaDex && mangaDexManga?.original_language && (
                  <div className="border-[var(--accent)]/50 border-l-2 pl-3">
                    <div className="text-[var(--muted-foreground)] text-xs">
                      ორიგინალი ენა
                    </div>
                    <div className="font-medium text-sm uppercase">
                      {mangaDexManga.original_language}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Marquee - only for local manga */}
      {!isMangaDex && localManga && (
        <section className="border-[var(--border)] border-b bg-[var(--accent)] py-8">
          <Marquee speed={80} gradient={false} className="overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={`marquee-stat-${i}-${localManga.id}`}
                className="mx-8 flex items-center gap-4"
              >
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-2xl text-[var(--accent-foreground)]">
                    {formatRating(localManga.rating)}
                  </span>
                  <Star className="h-6 w-6 fill-[var(--accent-foreground)] text-[var(--accent-foreground)]" />
                </div>
                <span className="text-[var(--accent-foreground)]/80 text-sm">
                  რეიტინგი
                </span>
                <span className="text-2xl text-[var(--accent-foreground)]/40">
                  •
                </span>
                <span className="font-semibold text-2xl text-[var(--accent-foreground)]">
                  {formatNumber(localManga.total_views)}
                </span>
                <span className="text-[var(--accent-foreground)]/80 text-sm">
                  სულ ნახვა
                </span>
                <span className="text-2xl text-[var(--accent-foreground)]/40">
                  •
                </span>
              </div>
            ))}
          </Marquee>
        </section>
      )}

      {/* Chapters Section */}
      <section className="py-8 md:py-8">
        <div className="container mx-auto max-w-[1920px] px-6 md:px-8">
          {/* Section Title */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
                თავები
              </h2>
              <div className="text-[var(--muted-foreground)] text-sm">
                სულ {chapters?.length || 0}
              </div>
            </div>

            {/* Language selector for MangaDex */}
            {isMangaDex && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--muted-foreground)] text-sm">
                  ენა:
                </span>
                <Dropdown
                  options={LANGUAGE_OPTIONS}
                  value={selectedLanguage}
                  onChange={(value) => setSelectedLanguage(value)}
                  className="min-w-[140px]"
                />
              </div>
            )}
          </div>

          {/* Chapter List - Glass Cards */}
          <div className="space-y-2">
            {chaptersLoading && isMangaDex ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : chapters && Array.isArray(chapters) && chapters.length > 0 ? (
              isMangaDex ? (
                // MangaDex chapters
                mangaDexChapters?.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/read/md-${chapter.id}`}
                    className="group block rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[rgba(26,26,36,0.8)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-[var(--foreground)] text-base group-hover:text-[var(--accent)]">
                          თავი {chapter.chapter_number}
                        </div>
                        {chapter.title && (
                          <div className="text-[var(--muted-foreground)] text-sm">
                            {chapter.title}
                          </div>
                        )}
                        {chapter.scanlation_group && (
                          <div className="text-[var(--muted-foreground)] text-xs">
                            {chapter.scanlation_group}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-[var(--muted-foreground)] text-xs">
                        <span>{chapter.pages_count} გვერდი</span>
                        <span>{formatDate(chapter.published_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                // Local chapters
                localChapters?.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/read/${chapter.id}`}
                    className="group block rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[rgba(26,26,36,0.8)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-[var(--foreground)] text-base group-hover:text-[var(--accent)]">
                          თავი {chapter.chapter_number}
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
                ))
              )
            ) : (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] backdrop-blur-sm">
                <p className="text-[var(--muted-foreground)] text-lg">
                  {isMangaDex
                    ? `თავები არ მოიძებნა (${selectedLanguage.toUpperCase()})`
                    : "თავები ჯერ არ არის დამატებული"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
