"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { uploadChapterPagesWithProgress } from "@/features/upload/api/upload-with-progress";
import { useCreateChapter } from "@/features/upload/hooks/use-create-chapter";
import { UserRole } from "@/types/user.types";
import { formatFileSize, validatePageImages } from "@/utils/file-validation";

function ChapterUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mangaId = searchParams.get("mangaId");

  const { data: user } = useCurrentUser();
  const createChapter = useCreateChapter(Number(mangaId));

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    chapterNumber: "",
    volumeNumber: "",
    title: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Check if user has permission
  if (user && user.role !== UserRole.UPLOADER && user.role !== UserRole.ADMIN) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 font-bold text-2xl">წვდომა აკრძალულია</h1>
        <p className="text-[var(--muted-foreground)]">
          ამ გვერდზე წვდომისთვის საჭიროა ატვირთვის უფლებები
        </p>
      </div>
    );
  }

  if (!mangaId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 font-bold text-2xl">შეცდომა</h1>
        <p className="text-[var(--muted-foreground)]">
          მანგის ID არ არის მითითებული
        </p>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate files
    const validation = validatePageImages(files);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setSelectedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.chapterNumber) {
      alert("გთხოვთ მიუთითოთ თავის ნომერი");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("გთხოვთ აირჩიოთ თავის გვერდები");
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

      alert(`თავი ${chapter.chapter_number} წარმატებით აიტვირთა!`);
      router.push(`/manga/${mangaId}`);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "თავის ატვირთვა ვერ მოხერხდა",
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="container mx-auto max-w-[1920px] px-6 py-8 md:px-8 lg:px-12">
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
            <Card className="border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
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
            <Card className="border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
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
                <div className="mb-6 rounded-lg border-2 border-[var(--border)] border-dashed bg-[var(--muted)] p-12 text-center transition-colors hover:border-[var(--accent)] hover:bg-[var(--muted)]/50">
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
                  <div className="max-h-60 space-y-2 overflow-y-auto rounded-sm border border-[var(--border)] bg-[var(--muted)] p-3">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded bg-[var(--background)] px-3 py-8"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[var(--muted-foreground)] text-xs">
                            {String(index + 1).padStart(3, "0")}
                          </span>
                          <span className="truncate text-sm">{file.name}</span>
                        </div>
                        <span className="text-[var(--muted-foreground)] text-xs">
                          {formatFileSize(file.size)}
                        </span>
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
                className="flex-1 bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
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
        <div className="container mx-auto px-4 py-8 text-center">
          იტვირთება...
        </div>
      }
    >
      <ChapterUploadContent />
    </Suspense>
  );
}
