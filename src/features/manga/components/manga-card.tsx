"use client";

import { Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import type { Manga } from "@/types/manga.types";
import { MangaStatus, TranslationStatus } from "@/types/manga.types";
import { formatRating } from "@/utils/formatters";
import { getCoverUrl } from "@/utils/image-urls";

interface MangaCardProps {
  readonly manga: Manga;
  readonly compact?: boolean;
}

const getTranslationStatusLabel = (status: TranslationStatus): string => {
  switch (status) {
    case TranslationStatus.TRANSLATING:
      return "ითარგმნება";
    case TranslationStatus.COMPLETED:
      return "თარგმნილი";
    default:
      return "";
  }
};

const getMangaStatusLabel = (status: MangaStatus): string => {
  switch (status) {
    case MangaStatus.ONGOING:
      return "გრძელდება";
    case MangaStatus.COMPLETED:
      return "დასრულებული";
    case MangaStatus.HIATUS:
      return "პაუზაზე";
    case MangaStatus.CANCELLED:
      return "გაუქმებული";
    default:
      return "";
  }
};

export function MangaCard({ manga, compact }: MangaCardProps) {
  const displayGenres = manga.genres?.slice(0, 3) || [];

  return (
    <Link href={`/manga/${manga.slug}`}>
      <Card className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] p-0 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[var(--border-hover)] hover:shadow-[0_10px_15px_rgba(0,0,0,0.3)]">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]/40">
          <Image
            src={getCoverUrl(manga.cover_image_url)}
            alt={manga.title}
            width={300}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Translation Status Badge - Top Left */}
          {!compact && manga.translation_status && (
            <div className="absolute top-2 left-2">
              <Badge
                variant={
                  manga.translation_status === TranslationStatus.COMPLETED
                    ? "success"
                    : "warning"
                }
                className="rounded-lg border-2 px-3 py-1.5 font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md"
              >
                {getTranslationStatusLabel(manga.translation_status)}
              </Badge>
            </div>
          )}
          {/* Manga Publication Status Badge - Top Right */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={
                manga.status === MangaStatus.COMPLETED
                  ? "default"
                  : manga.status === MangaStatus.ONGOING
                    ? "success"
                    : manga.status === MangaStatus.HIATUS
                      ? "warning"
                      : "danger"
              }
              className={`rounded-lg border-2 px-3 py-1.5 font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md ${
                manga.status === MangaStatus.COMPLETED ? "!text-green-400" : ""
              }`}
            >
              {getMangaStatusLabel(manga.status)}
            </Badge>
          </div>
        </div>
        <div
          className={`flex flex-col ${compact ? "h-auto p-2" : "h-[180px] p-4"}`}
        >
          <h3
            className={`mb-2 font-medium text-[var(--foreground)] tracking-tight transition-colors duration-200 group-hover:text-[var(--accent)] ${compact ? "truncate text-sm" : "line-clamp-2 text-base"}`}
          >
            {manga.title}
          </h3>
          {!compact && displayGenres.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {displayGenres.map((genre, index) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className={`px-1.5 py-0.5 text-[10px] ${index >= 2 ? "hidden md:inline-flex" : ""}`}
                >
                  {genre.name_ka || genre.name}
                </Badge>
              ))}
            </div>
          )}
          <div
            className={`mt-auto flex items-center justify-between border-[var(--border)] border-t text-[var(--muted-foreground)] ${compact ? "pt-2" : "pt-3"}`}
          >
            <div
              className={`flex items-center gap-1.5 ${compact ? "text-xs" : "text-sm"}`}
            >
              <Star
                className={`fill-[var(--accent)] text-[var(--accent)] ${compact ? "h-3 w-3" : "h-4 w-4"}`}
              />
              <span>{formatRating(manga.rating)}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 ${compact ? "text-[10px]" : "text-xs"}`}
            >
              <Eye className={compact ? "h-3 w-3" : "h-4 w-4"} />
              <span>{manga.total_views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
