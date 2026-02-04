"use client";

import { Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import type { Manga } from "@/types/manga.types";
import { TranslationStatus } from "@/types/manga.types";
import { formatRating } from "@/utils/formatters";
import { getCoverUrl } from "@/utils/image-urls";

interface MangaCardProps {
  readonly manga: Manga;
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

export function MangaCard({ manga }: MangaCardProps) {
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
          {manga.translation_status && (
            <div className="absolute top-2 left-2">
              <Badge
                variant={
                  manga.translation_status === TranslationStatus.COMPLETED
                    ? "success"
                    : "warning"
                }
                className="rounded-md text-xs"
              >
                {getTranslationStatusLabel(manga.translation_status)}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex h-[180px] flex-col p-4">
          <h3 className="mb-2 line-clamp-2 font-medium text-[var(--foreground)] text-base tracking-tight transition-colors duration-200 group-hover:text-[var(--accent)]">
            {manga.title}
          </h3>
          {displayGenres.length > 0 && (
            <div className="mb-3 flex max-h-[44px] flex-wrap gap-1 overflow-hidden">
              {displayGenres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="px-1.5 py-0.5 text-[10px]"
                >
                  {genre.name_ka || genre.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-auto flex items-center justify-between border-[var(--border)] border-t pt-3 text-[var(--muted-foreground)]">
            <div className="flex items-center gap-1.5 text-sm">
              <Star className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
              <span>{formatRating(manga.rating)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Eye className="h-4 w-4" />
              <span>{manga.total_views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
