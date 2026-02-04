"use client";

import { Languages } from "lucide-react";
import { useMangaList } from "../hooks";
import { MangaGrid } from "./manga-grid";

export function TrendingSection() {
  const { data, isLoading } = useMangaList({
    limit: 10,
    language: "georgian",
    sort_by: "updated_at",
    order_desc: true,
  });

  return (
    <section className="mb-16 border-[var(--border)] border-b pb-16">
      <div className="mb-8">
        <h2 className="mb-3 flex items-center gap-3 font-semibold text-2xl tracking-tight sm:text-3xl">
          <Languages
            className="h-7 w-7 text-[var(--accent)]"
            strokeWidth={1.5}
          />
          ქართულად თარგმნილი
        </h2>
        <p className="text-[var(--muted-foreground)] text-base">
          ჩვენს საიტზე ატვირთული მანგა ქართულ ენაზე
        </p>
      </div>
      <MangaGrid manga={data?.items || []} isLoading={isLoading} />
    </section>
  );
}
