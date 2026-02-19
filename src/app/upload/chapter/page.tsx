"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Spinner } from "@/components/spinner";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { getMangaDetail } from "@/features/manga/api/get-manga-detail";
import { uploadChapterPagesWithProgress } from "@/features/upload/api/upload-with-progress";
import { useCreateChapter } from "@/features/upload/hooks/use-create-chapter";
import { useAlertModal } from "@/hooks/use-alert-modal";
import { formatFileSize, validatePageImages } from "@/utils/file-validation";

function ChapterUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mangaId = searchParams.get("mangaId");

  const { data: user, isLoading: userLoading } = useCurrentUser();
  const createChapter = useCreateChapter(Number(mangaId));

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    chapterNumber: "",
    volumeNumber: "",
    title: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { showAlert, AlertModalComponent } = useAlertModal();

  const previewUrls = useMemo(
    () => selectedFiles.map((file) => URL.createObjectURL(file)),
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      for (const url of previewUrls) {
        URL.revokeObjectURL(url);
      }
    };
  }, [previewUrls]);

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  if (userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-2 py-12 text-center sm:px-4 md:px-8">
        <h1 className="mb-4 font-bold text-2xl">შესვლა საჭიროა</h1>
        <p className="text-[var(--muted-foreground)]">
          თავის ასატვირთად გთხოვთ შეხვიდეთ სისტემაში
        </p>
      </div>
    );
  }

  if (!mangaId) {
    return (
      <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-2 py-12 text-center sm:px-4 md:px-8">
        <h1 className="mb-4 font-bold text-2xl">შეცდომა</h1>
        <p className="text-[var(--muted-foreground)]">
          მანგის ID არ არის მითითებული
        </p>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validation = validatePageImages(files);
    if (!validation.valid) {
      showAlert(validation.error ?? "", "error");
      return;
    }

    setSelectedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.chapterNumber) {
      showAlert("გთხოვთ მიუთითოთ თავის ნომერი", "error");
      return;
    }

    if (selectedFiles.length === 0) {
      showAlert("გთხოვთ აირჩიოთ თავის გვერდები", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Create chapter
      const chapter = await createChapter.mutateAsync({
        chapter_number: Number(formData.chapterNumber),
        title: formData.title || undefined,
        volume: formData.volumeNumber
          ? Number(formData.volumeNumber)
          : undefined,
      });

      setUploadProgress(30);

      // Step 2: Upload pages with progress tracking
      await uploadChapterPagesWithProgress({
        mangaId: Number(mangaId),
        chapterId: chapter.id,
        files: selectedFiles,
        onProgress: (progress) => {
          // Map upload progress from 30% to 100%
          setUploadProgress(30 + progress * 0.7);
        },
      });

      setUploadProgress(100);

      const manga = await getMangaDetail(Number(mangaId));

      showAlert(
        `თავი ${chapter.chapter_number} წარმატებით აიტვირთა!`,
        "success",
      );
      router.push(`/manga/${manga.slug}`);
    } catch (error) {
      showAlert(
        error instanceof Error ? error.message : "თავის ატვირთვა ვერ მოხერხდა",
        "error",
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-2 py-8 sm:px-4 md:px-8">
      {AlertModalComponent}
      <div className="mb-16">
        <h1 className="mb-6 font-bold text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-none tracking-tighter">
          თავის ატვირთვა
        </h1>
        <p className="max-w-2xl text-[var(--muted-foreground)] text-lg">
          დაამატეთ ახალი თავი არსებულ მანგას. ატვირთეთ თავის გვერდები სწორი
          თანმიმდევრობით.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Chapter Info */}
          <div className="lg:col-span-1">
            <Card className="border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="mb-6 font-semibold text-lg tracking-tight">
                თავის ინფორმაცია
              </h3>
              <div className="space-y-6">
                {/* Chapter Number */}
                <div>
                  <label
                    htmlFor="chapterNumber"
                    className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                  >
                    თავის ნომერი *
                  </label>
                  <Input
                    id="chapterNumber"
                    type="number"
                    step="0.1"
                    value={formData.chapterNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        chapterNumber: e.target.value,
                      }))
                    }
                    required
                    placeholder="1"
                    className="border-[var(--border)] bg-[var(--muted)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                </div>

                {/* Volume Number */}
                <div>
                  <label
                    htmlFor="volumeNumber"
                    className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                  >
                    ტომის ნომერი
                  </label>
                  <Input
                    id="volumeNumber"
                    type="number"
                    value={formData.volumeNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        volumeNumber: e.target.value,
                      }))
                    }
                    placeholder="1"
                    className="border-[var(--border)] bg-[var(--muted)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                </div>

                {/* Chapter Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                  >
                    თავის სათაური
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="თავი 1: დასაწყისი"
                    className="border-[var(--border)] bg-[var(--muted)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Pages Upload */}
          <div className="space-y-8 lg:col-span-2">
            <Card className="border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="mb-6 font-semibold text-lg tracking-tight">
                თავის გვერდები
              </h3>

              {/* File Input */}
              <label className="block cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="mb-6 flex flex-col items-center justify-center rounded-[3px] border-2 border-[var(--border)] border-dashed bg-[var(--muted)] p-12 text-center transition-colors hover:border-[var(--accent)] hover:bg-[var(--muted)]/50">
                  <svg
                    className="mx-auto mb-4 h-16 w-16 text-[var(--muted-foreground)] opacity-40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="ფაილების ატვირთვა"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 font-medium">
                    დააჭირეთ ან გადმოიტანეთ ფაილები აქ
                  </p>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    JPG, PNG ან WebP (მაქს. 10MB თითო ფაილზე)
                  </p>
                </div>
              </label>

              {/* Selected Files Info */}
              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium">
                      არჩეულია {selectedFiles.length} ფაილი
                    </p>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      სულ: {formatFileSize(totalSize)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 rounded-sm border border-[var(--border)] bg-[var(--muted)] p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="overflow-hidden rounded bg-[var(--background)]"
                      >
                        <div className="relative aspect-[2/3]">
                          <Image
                            src={previewUrls[index]}
                            alt={`გვერდი ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <span className="absolute top-1 left-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-white text-xs">
                            {String(index + 1).padStart(3, "0")}
                          </span>
                        </div>
                        <div className="px-2 py-1.5">
                          <p className="truncate text-xs">{file.name}</p>
                          <p className="text-[var(--muted-foreground)] text-xs">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>ატვირთვა...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                    <div
                      className="h-full bg-[var(--accent)] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Submit Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                disabled={isUploading || selectedFiles.length === 0}
                loading={isUploading}
                className="flex-1 whitespace-nowrap bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
              >
                {isUploading ? "იტვირთება..." : "თავის ატვირთვა"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isUploading}
                className="border-[var(--border)] hover:bg-[var(--muted)]"
              >
                გაუქმება
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function ChapterUploadPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-2 py-12 text-center sm:px-4 md:px-8">
          იტვირთება...
        </div>
      }
    >
      <ChapterUploadContent />
    </Suspense>
  );
}
