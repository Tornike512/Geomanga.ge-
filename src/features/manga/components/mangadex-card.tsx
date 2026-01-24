"use client";

import { Globe, Languages, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import type { MangaDexTransformedManga } from "@/types/mangadex.types";

const LANGUAGE_FLAGS: Record<string, string> = {
  en: "🇬🇧",
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
  "zh-hk": "🇭🇰",
  es: "🇪🇸",
  "es-la": "🇲🇽",
  fr: "🇫🇷",
  de: "🇩🇪",
  "pt-br": "🇧🇷",
  pt: "🇵🇹",
  ru: "🇷🇺",
  it: "🇮🇹",
  pl: "🇵🇱",
  tr: "🇹🇷",
  ar: "🇸🇦",
  id: "🇮🇩",
  vi: "🇻🇳",
  th: "🇹🇭",
  uk: "🇺🇦",
  ka: "🇬🇪",
};

interface MangaDexCardProps {
  readonly manga: MangaDexTransformedManga;
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "ongoing":
      return "მიმდინარე";
    case "completed":
      return "დასრულებული";
    case "hiatus":
      return "შეჩერებული";
    case "cancelled":
      return "გაუქმებული";
    default:
      return status;
  }
};

const getStatusVariant = (
  status: string,
): "default" | "success" | "warning" | "danger" => {
  switch (status) {
    case "ongoing":
      return "success";
    case "completed":
      return "default";
    case "hiatus":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
};

export function MangaDexCard({ manga }: MangaDexCardProps) {
  const displayTags = manga.tags.slice(0, 3);
  // Use md-{mangadex_id} slug format to identify MangaDex manga
  const localUrl = `/manga/md-${manga.mangadex_id}`;

  return (
    <Link href={localUrl} className="block">
      <Card className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] p-0 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[var(--border-hover)] hover:shadow-[0_10px_15px_rgba(0,0,0,0.3)]">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]/40">
          {manga.cover_image_url ? (
            <Image
              src={manga.cover_image_url}
              alt={manga.title}
              width={256}
              height={384}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[var(--muted)]">
              <span className="text-[var(--muted-foreground)]">No Cover</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Badge
              variant={getStatusVariant(manga.status)}
              className="rounded-md"
            >
              {getStatusLabel(manga.status)}
            </Badge>
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="rounded-md text-xs">
              <Globe className="mr-1 h-3 w-3" />
              MangaDex
            </Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 line-clamp-2 font-medium text-[var(--foreground)] text-base tracking-tight transition-colors duration-200 group-hover:text-[var(--accent)]">
            {manga.title}
          </h3>
          {displayTags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {displayTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="px-1.5 py-0.5 text-[10px]"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          {/* Available Languages */}
          {manga.available_languages &&
            manga.available_languages.length > 0 && (
              <div className="mb-3 flex items-center gap-1.5">
                <Languages className="h-3 w-3 text-[var(--muted-foreground)]" />
                <div className="flex flex-wrap gap-1">
                  {manga.available_languages.slice(0, 6).map((lang) => (
                    <span
                      key={lang}
                      className="text-sm"
                      title={lang.toUpperCase()}
                    >
                      {LANGUAGE_FLAGS[lang] || lang.toUpperCase()}
                    </span>
                  ))}
                  {manga.available_languages.length > 6 && (
                    <span className="text-[var(--muted-foreground)] text-xs">
                      +{manga.available_languages.length - 6}
                    </span>
                  )}
                </div>
              </div>
            )}
          <div className="mt-auto flex items-center justify-between border-[var(--border)] border-t pt-3 text-[var(--muted-foreground)]">
            {manga.author && (
              <div className="flex items-center gap-1.5 text-xs">
                <User className="h-3 w-3" />
                <span className="line-clamp-1">{manga.author}</span>
              </div>
            )}
            {manga.year && <span className="text-xs">{manga.year}</span>}
          </div>
        </div>
      </Card>
    </Link>
  );
}
