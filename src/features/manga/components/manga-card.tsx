"use client";

import { Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import type { Manga } from "@/types/manga.types";
import { formatRating } from "@/utils/formatters";
import { getCoverUrl } from "@/utils/image-urls";

interface MangaCardProps {
  readonly manga: Manga;
}

export function MangaCard({ manga }: MangaCardProps) {
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

  return (
    <Link href={`/manga/${manga.slug}`}>
      <Card className="group relative cursor-pointer overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[var(--border-hover)] hover:shadow-[0_10px_15px_rgba(0,0,0,0.3)]">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]/40">
          <Image
            src={getCoverUrl(manga.cover_image_url)}
            alt={manga.title}
            width={300}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge
              variant={getStatusVariant(manga.status)}
              className="rounded-md"
            >
              {manga.status}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-3 line-clamp-2 font-medium text-[var(--foreground)] text-base tracking-tight transition-colors duration-200 group-hover:text-[var(--accent)]">
            {manga.title}
          </h3>
          <div className="flex items-center justify-between border-[var(--border)] border-t pt-3 text-[var(--muted-foreground)]">
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
