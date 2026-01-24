"use client";

import { Globe } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { useMangaDexPopular } from "../hooks/use-mangadex-manga";
import { MangaDexCard } from "./mangadex-card";

export function MangaDexSection() {
  const { data: mangaList, isLoading, error } = useMangaDexPopular();

  if (error) {
    return (
      <section className="mb-16 border-[var(--border)] border-b pb-16">
        <div className="mb-8">
          <h2 className="mb-3 flex items-center gap-3 font-semibold text-2xl tracking-tight sm:text-3xl">
            <Globe className="h-7 w-7 text-[var(--accent)]" strokeWidth={1.5} />
            MangaDex-დან
          </h2>
          <p className="text-[var(--muted-foreground)] text-base">
            პოპულარული მანგა MangaDex-დან
          </p>
        </div>
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] backdrop-blur-sm">
          <p className="text-[var(--muted-foreground)] text-lg">
            მონაცემების ჩატვირთვა ვერ მოხერხდა
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16 border-[var(--border)] border-b pb-16">
      <div className="mb-8">
        <h2 className="mb-3 flex items-center gap-3 font-semibold text-2xl tracking-tight sm:text-3xl">
          <Globe className="h-7 w-7 text-[var(--accent)]" strokeWidth={1.5} />
          MangaDex-დან
        </h2>
        <p className="text-[var(--muted-foreground)] text-base">
          პოპულარული მანგა MangaDex-დან
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : !mangaList || mangaList.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] backdrop-blur-sm">
          <p className="text-[var(--muted-foreground)] text-lg">
            მანგა არ მოიძებნა
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {mangaList.map((manga) => (
            <MangaDexCard key={manga.id} manga={manga} />
          ))}
        </div>
      )}
    </section>
  );
}
