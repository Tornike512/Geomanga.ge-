"use client";

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
      <Card className="group cursor-pointer overflow-hidden transition-all hover:scale-105">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={getCoverUrl(manga.cover_image_url)}
            alt={manga.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={getStatusVariant(manga.status)}>
              {manga.status}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
            {manga.title}
          </h3>
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span>{formatRating(manga.rating)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>👁️</span>
              <span>{manga.total_views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
