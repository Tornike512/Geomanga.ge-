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
      <Card className="group relative cursor-pointer overflow-hidden rounded-none border-0 transition-all hover:border-2 hover:border-[#DFE104] hover:bg-[#DFE104]">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#27272A]">
          <Image
            src={getCoverUrl(manga.cover_image_url)}
            alt={manga.title}
            width={300}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-0 right-0">
            <Badge
              variant={getStatusVariant(manga.status)}
              className="rounded-none border-0"
            >
              {manga.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <h3 className="mb-4 line-clamp-2 font-bold text-[#FAFAFA] text-xl uppercase tracking-tight group-hover:text-[#000000]">
            {manga.title}
          </h3>
          <div className="flex items-center justify-between border-[#3F3F46] border-t-2 pt-4 text-[#A1A1AA] group-hover:border-[#000000] group-hover:text-[#000000]">
            <div className="flex items-center gap-2 font-bold">
              <Star className="h-5 w-5 fill-current" />
              <span className="text-lg">{formatRating(manga.rating)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-wider">
              <Eye className="h-5 w-5" />
              <span>{manga.total_views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
