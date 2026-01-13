"use client";

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";
import { useChapterWithPages } from "@/features/reader/hooks/use-chapter-with-pages";
import { useTrackReading } from "@/features/reader/hooks/use-track-reading";

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;

  const {
    data: chapter,
    isLoading,
    error,
  } = useChapterWithPages(Number(chapterId));
  const trackReading = useTrackReading();

  // Track reading progress when chapter loads
  useEffect(() => {
    if (chapter) {
      trackReading.mutate({
        manga_id: chapter.manga_id,
        chapter_id: chapter.id,
      });
    }
  }, [chapter?.id, chapter?.manga_id, trackReading, chapter]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-full max-w-4xl p-4">
          <Skeleton className="h-screen w-full" />
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="mb-4 font-bold text-2xl">თავი ვერ მოიძებნა</h1>
          <Button onClick={() => router.back()}>უკან</Button>
        </div>
      </div>
    );
  }

  if (!chapter.pages || chapter.pages.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="mb-4 font-bold text-2xl">გვერდები ვერ მოიძებნა</h1>
          <p className="mb-4 text-gray-400">
            ამ თავს ჯერ არ აქვს ატვირთული გვერდები
          </p>
          <Button onClick={() => router.back()}>უკან</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-50 border-[var(--border)] border-b bg-[var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-8">
          <div className="flex items-center gap-4">
            {chapter.manga ? (
              <Link href={`/manga/${chapter.manga.slug}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  უკან
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                უკან
              </Button>
            )}
            <div className="text-white">
              <h1 className="font-medium text-base tracking-tight">
                {chapter.manga?.title || "უცნობი მანგა"}
              </h1>
              <p className="text-[var(--muted-foreground)] text-sm">
                თავი {chapter.chapter_number}
                {chapter.title ? `: ${chapter.title}` : ""}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-[var(--accent)] px-4 py-8 font-medium text-[var(--accent-foreground)] text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            {chapter.pages.length} გვერდი
          </div>
        </div>
      </div>

      {/* Reader Content - Vertical Scroll (Webtoon Style) */}
      <div className="pt-20 pb-24">
        <div className="mx-auto max-w-4xl">
          {chapter.pages.map((page) => (
            <div key={page.id} className="w-full">
              <Image
                src={page.image_url}
                alt={`გვერდი ${page.page_number}`}
                width={1200}
                height={1800}
                className="h-auto w-full"
                priority={page.page_number <= 3}
                loading={page.page_number > 3 ? "lazy" : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Chapter Navigation */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-[var(--border)] border-t bg-[var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-8">
          {chapter.previous_chapter_id ? (
            <Link href={`/read/${chapter.previous_chapter_id}`}>
              <Button size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" />
                წინა თავი
              </Button>
            </Link>
          ) : (
            <Button size="sm" disabled>
              <ChevronLeft className="mr-1 h-4 w-4" />
              წინა თავი
            </Button>
          )}

          <div className="text-[var(--muted-foreground)] text-sm">
            თავი {chapter.chapter_number}
          </div>

          {chapter.next_chapter_id ? (
            <Link href={`/read/${chapter.next_chapter_id}`}>
              <Button size="sm">
                შემდეგი თავი
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button size="sm" disabled>
              შემდეგი თავი
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
