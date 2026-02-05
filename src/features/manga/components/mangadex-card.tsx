"use client";

import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import type { MangaDexTransformedManga } from "@/types/mangadex.types";

interface MangaDexCardProps {
  readonly manga: MangaDexTransformedManga;
}

const getMangaStatusLabel = (
  status: "ongoing" | "completed" | "hiatus" | "cancelled",
): string => {
  switch (status) {
    case "ongoing":
      return "გრძელდება";
    case "completed":
      return "დასრულებული";
    case "hiatus":
      return "პაუზაზე";
    case "cancelled":
      return "გაუქმებული";
    default:
      return "";
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
          {/* Manga Publication Status Badge - Top Right */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={
                manga.status === "completed"
                  ? "default"
                  : manga.status === "ongoing"
                    ? "success"
                    : manga.status === "hiatus"
                      ? "warning"
                      : "danger"
              }
              className={`rounded-lg border-2 px-3 py-1.5 font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md ${
                manga.status === "completed" ? "!text-green-400" : ""
              }`}
            >
              {getMangaStatusLabel(manga.status)}
            </Badge>
          </div>
        </div>
        <div className="flex h-[180px] flex-col p-4">
          <h3 className="mb-2 line-clamp-2 font-medium text-[var(--foreground)] text-base tracking-tight transition-colors duration-200 group-hover:text-[var(--accent)]">
            {manga.title}
          </h3>
          {displayTags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {displayTags.map((tag, index) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className={`px-1.5 py-0.5 text-[10px] ${index >= 2 ? "hidden md:inline-flex" : ""}`}
                >
                  {tag.name}
                </Badge>
              ))}
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
