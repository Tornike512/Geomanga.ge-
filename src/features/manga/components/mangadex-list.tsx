"use client";

import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/components/spinner";
import { useFetchMangaDex } from "../hooks/use-fetch-mangadex";

export function MangaDexList() {
  const { data: mangas, isLoading, error } = useFetchMangaDex(20);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-[var(--muted-foreground)]">
        Failed to load manga
      </div>
    );
  }

  if (!mangas || mangas.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-[var(--muted-foreground)]">
        No manga found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {mangas.map((manga) => (
        <Link
          key={manga.id}
          href={`/manga/md-${manga.id}`}
          className="group overflow-hidden rounded-[3px] border border-[var(--border)] bg-[var(--card)] transition-all hover:border-[var(--accent)]"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            {manga.coverUrl ? (
              <Image
                src={manga.coverUrl}
                alt={manga.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--muted)]">
                <span className="text-[var(--muted-foreground)]">No Image</span>
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="line-clamp-2 font-medium text-sm">{manga.title}</h3>
            {manga.author && (
              <p className="mt-1 truncate text-[var(--muted-foreground)] text-xs">
                {manga.author}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
