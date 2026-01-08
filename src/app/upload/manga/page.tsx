"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Dropdown } from "@/components/dropdown";
import { Input } from "@/components/input";
import { API_URL } from "@/config";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useGenres } from "@/features/genres/hooks/use-genres";
import { useCreateManga } from "@/features/manga/hooks/use-create-manga";
import { uploadChapterPagesWithProgress } from "@/features/upload/api/upload-with-progress";
import { useUploadCover } from "@/features/upload/hooks/use-upload-cover";
import type { MangaStatus } from "@/types/manga.types";
import { UserRole } from "@/types/user.types";
import {
  formatFileSize,
  validateCoverImage,
  validatePageImages,
} from "@/utils/file-validation";
export default function UploadMangaPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: genres } = useGenres();
  const createManga = useCreateManga();
  const uploadCover = useUploadCover();

  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    alternativeTitle: "",
    description: "",
    author: "",
    artist: "",
    status: "ongoing" as MangaStatus,
    releaseYear: new Date().getFullYear(),
    genreIds: [] as number[],
  });
  const [chapters, setChapters] = useState<
    Array<{
      id: string;
      chapterNumber: string;
      volumeNumber: string;
      title: string;
      files: File[];
    }>
  >([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate cover image
      const validation = validateCoverImage(file);
      if (!validation.valid) {
        alert(validation.error);
        e.target.value = "";
        return;
      }

      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreToggle = (genreId: number) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter((id) => id !== genreId)
        : [...prev.genreIds, genreId],
    }));
  };

  const handleAddChapter = () => {
    const nextChapterNum = chapters.length + 1;
    setChapters((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        chapterNumber: nextChapterNum.toString(),
        volumeNumber: "1",
        title: `თავი ${nextChapterNum}`,
        files: [],
      },
    ]);
  };

  const handleRemoveChapter = (id: string) => {
    setChapters((prev) => prev.filter((c) => c.id !== id));
  };

  const handleChapterChange = (
    id: string,
    field: string,
    value: string | File[],
  ) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  const handleChapterFilesChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate files
    const validation = validatePageImages(files);
    if (!validation.valid) {
      alert(validation.error);
      e.target.value = "";
      return;
    }

    handleChapterChange(id, "files", files);
  };

  const onBulkDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      // Validate files
      const validation = validatePageImages(acceptedFiles);

      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      // Create one chapter with all files
      const chapterNum = chapters.length + 1;
      const newChapter = {
        id: Math.random().toString(36).substr(2, 9),
        chapterNumber: chapterNum.toString(),
        volumeNumber: "1",
        title: `თავი ${chapterNum}`,
        files: acceptedFiles,
      };

      setChapters((prev) => [...prev, newChapter]);
    },
    [chapters.length],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onBulkDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
    disabled: isUploading,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!coverFile) {
      alert("გთხოვთ ატვირთოთ ყდის სურათი");
      return;
    }

    if (!formData.alternativeTitle) {
      alert("გთხოვთ შეიყვანოთ ალტერნატიული სათაური");
      return;
    }

    if (!formData.artist) {
      alert("გთხოვთ შეიყვანოთ მხატვარი");
      return;
    }

    if (chapters.length === 0) {
      alert("გთხოვთ დაამატოთ მინიმუმ ერთი თავი");
      return;
    }

    // Validate chapters
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      if (!chapter.chapterNumber) {
        alert(`გთხოვთ შეიყვანოთ თავის ნომერი თავისთვის ${i + 1}`);
        return;
      }
      if (!chapter.title) {
        alert(`გთხოვთ შეიყვანოთ თავის სათაური თავისთვის ${i + 1}`);
        return;
      }
      if (chapter.files.length === 0) {
        alert(`გთხოვთ ატვირთოთ გვერდები თავისთვის ${i + 1}`);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Create manga (20%)
      setCurrentStep("მანგის შექმნა...");
      const manga = await createManga.mutateAsync({
        title: formData.title,
        description: formData.description,
        author: formData.author,
        artist: formData.artist,
        status: formData.status,
        genre_ids: formData.genreIds,
        cover_image_url: "",
      });
      setUploadProgress(20);

      // Step 2: Upload cover if provided (40%)
      if (coverFile) {
        setCurrentStep("ყდის სურათის ატვირთვა...");
        try {
          await uploadCover.mutateAsync({ file: coverFile, mangaId: manga.id });
          setUploadProgress(40);
        } catch {
          alert("მანგა შეიქმნა, მაგრამ ყდის სურათის ატვირთვა ვერ მოხერხდა");
          setUploadProgress(40);
        }
      } else {
        setUploadProgress(40);
      }

      // Step 3: Upload chapters if provided (40% - 100%)
      if (chapters.length > 0) {
        const progressPerChapter = 60 / chapters.length;

        for (let i = 0; i < chapters.length; i++) {
          const chapter = chapters[i];

          if (!chapter.chapterNumber || chapter.files.length === 0) {
            continue;
          }

          setCurrentStep(`თავის ${chapter.chapterNumber} ატვირთვა...`);

          // Create chapter
          const response = await fetch(
            `${API_URL}/manga/${manga.id}/chapters`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                chapter_number: Number(chapter.chapterNumber),
                title: chapter.title || undefined,
                volume: chapter.volumeNumber
                  ? Number(chapter.volumeNumber)
                  : undefined,
              }),
            },
          );
          const { id: chapterId } = (await response.json()) as { id: number };

          // Upload pages for this chapter
          await uploadChapterPagesWithProgress({
            mangaId: manga.id,
            chapterId,
            files: chapter.files,
            onProgress: (progress) => {
              const baseProgress = 40 + i * progressPerChapter;
              setUploadProgress(
                baseProgress + (progress / 100) * progressPerChapter,
              );
            },
          });
        }

        setUploadProgress(100);
      }

      setCurrentStep("დასრულდა!");
      setTimeout(() => {
        router.push(`/manga/${manga.slug}`);
      }, 500);
    } catch {
      alert("მანგის შექმნა ვერ მოხერხდა");
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentStep("");
    }
  };

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

  return (
    <div className="container mx-auto max-w-[1920px] px-6 py-24 md:px-8 lg:px-12">
      <div className="mb-16">
        <h1 className="mb-6 font-bold text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-none tracking-tighter">
          მანგის ატვირთვა
        </h1>
        <p className="max-w-2xl text-[var(--muted-foreground)] text-lg">
          დაამატეთ ახალი მანგის სერია პლატფორმაზე. შეავსეთ დეტალები და ატვირთეთ
          ყდის სურათი.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Cover Image */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
              <h3 className="mb-6 font-semibold text-lg tracking-tight">
                ყდის სურათი *
              </h3>
              <div className="mb-6 aspect-[2/3] overflow-hidden rounded-sm bg-[var(--muted)] ring-1 ring-[var(--border)]">
                {coverPreview ? (
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    width={400}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--muted-foreground)]">
                    <div className="text-center">
                      <svg
                        className="mx-auto mb-3 h-16 w-16 opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-label="Upload image"
                        role="img"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">ყდის სურათი არ არის</p>
                    </div>
                  </div>
                )}
              </div>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                  id="cover-upload-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => {
                    const input = document.getElementById(
                      "cover-upload-input",
                    ) as HTMLInputElement;
                    input?.click();
                  }}
                >
                  {coverPreview ? "ყდის შეცვლა" : "ყდის ატვირთვა"}
                </Button>
              </label>
            </Card>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-8 lg:col-span-2">
            <Card className="border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
              <h3 className="mb-6 font-semibold text-lg tracking-tight">
                ძირითადი ინფორმაცია
              </h3>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                  >
                    სათაური *
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
                    required
                    placeholder="შეიყვანეთ მანგის სათაური"
                    className="border-[var(--border)] bg-[var(--muted)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                </div>

                {/* Alternative Title */}
                <div>
                  <label
                    htmlFor="alternativeTitle"
                    className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                  >
                    ალტერნატიული სათაური *
                  </label>
                  <Input
                    id="alternativeTitle"
                    type="text"
                    value={formData.alternativeTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        alternativeTitle: e.target.value,
                      }))
                    }
                    required
                    placeholder="ალტერნატიული ან იაპონური სათაური"
                    className="border-[var(--border)] bg-[var(--muted)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                  >
                    აღწერა *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                    rows={6}
                    className="w-full rounded-sm border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                    placeholder="შეიყვანეთ მანგის აღწერა..."
                  />
                </div>

                {/* Author & Artist */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="author"
                      className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                    >
                      ავტორი *
                    </label>
                    <Input
                      id="author"
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      required
                      placeholder="ავტორის სახელი"
                      className="border-[var(--border)] bg-[var(--muted)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="artist"
                      className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                    >
                      მხატვარი *
                    </label>
                    <Input
                      id="artist"
                      type="text"
                      value={formData.artist}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          artist: e.target.value,
                        }))
                      }
                      required
                      placeholder="მხატვრის სახელი"
                      className="border-[var(--border)] bg-[var(--muted)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                  </div>
                </div>

                {/* Status & Release Year */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="status"
                      className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                    >
                      სტატუსი *
                    </label>
                    <Dropdown
                      id="status"
                      options={[
                        { value: "ongoing", label: "გრძელდება" },
                        { value: "completed", label: "დასრულებული" },
                        { value: "hiatus", label: "პაუზაზე" },
                        { value: "cancelled", label: "გაუქმებული" },
                      ]}
                      value={formData.status}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: value as MangaStatus,
                        }))
                      }
                      aria-label="მანგის სტატუსი"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="releaseYear"
                      className="mb-2 block font-medium text-[var(--muted-foreground)] text-sm"
                    >
                      გამოშვების წელი *
                    </label>
                    <Input
                      id="releaseYear"
                      type="number"
                      value={formData.releaseYear}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          releaseYear: Number(e.target.value),
                        }))
                      }
                      required
                      min={1900}
                      max={new Date().getFullYear() + 1}
                      className="border-[var(--border)] bg-[var(--muted)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Genres */}
            <Card className="border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-lg tracking-tight">
                ჟანრები
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres?.map((genre) => (
                  <Button
                    key={genre.id}
                    type="button"
                    variant="ghost"
                    onClick={() => handleGenreToggle(genre.id)}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <Badge
                      variant={
                        formData.genreIds.includes(genre.id)
                          ? "default"
                          : "secondary"
                      }
                      className="cursor-pointer transition-all hover:opacity-80"
                    >
                      {genre.name}
                    </Badge>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Chapters */}
            <Card className="border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-lg tracking-tight">
                თავები *
              </h3>

              {/* Bulk Upload Section - Only show when no chapters exist */}
              {chapters.length === 0 && (
                <div className="mb-6">
                  <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                      isDragActive
                        ? "border-[var(--accent)] bg-[var(--accent)]/10"
                        : "border-[var(--border)] bg-[var(--muted)] hover:border-[var(--accent)] hover:bg-[var(--muted)]/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <svg
                      className="mx-auto mb-3 h-12 w-12 text-[var(--muted-foreground)] opacity-40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-label="ატვირთვა"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 font-medium text-base">
                      {isDragActive ? "ჩააგდეთ ფაილები აქ" : "თავის ატვირთვა"}
                    </p>
                    <p className="mx-auto text-[var(--muted-foreground)] text-sm">
                      აირჩიეთ ან გადმოიტანეთ სურათები ერთი თავისთვის
                    </p>
                  </div>
                </div>
              )}

              {chapters.length === 0 ? (
                <p className="mx-auto py-4 text-center text-[var(--muted-foreground)] text-sm">
                  თავები არ არის დამატებული
                </p>
              ) : (
                <>
                  <div className="space-y-4">
                    {chapters.map((chapter, index) => (
                      <div
                        key={chapter.id}
                        className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-medium text-sm">
                            თავი {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveChapter(chapter.id)}
                            disabled={isUploading}
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              role="img"
                              aria-label="წაშლა"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <label
                              htmlFor={`chapter-number-${chapter.id}`}
                              className="mb-1 block text-[var(--muted-foreground)] text-xs"
                            >
                              თავის ნომერი *
                            </label>
                            <Input
                              id={`chapter-number-${chapter.id}`}
                              type="number"
                              step="0.1"
                              value={chapter.chapterNumber}
                              onChange={(e) =>
                                handleChapterChange(
                                  chapter.id,
                                  "chapterNumber",
                                  e.target.value,
                                )
                              }
                              placeholder="1"
                              disabled={isUploading}
                              className="border-[var(--border)] bg-[var(--background)]"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`chapter-title-${chapter.id}`}
                              className="mb-1 block text-[var(--muted-foreground)] text-xs"
                            >
                              თავის სათაური *
                            </label>
                            <Input
                              id={`chapter-title-${chapter.id}`}
                              type="text"
                              value={chapter.title}
                              onChange={(e) =>
                                handleChapterChange(
                                  chapter.id,
                                  "title",
                                  e.target.value,
                                )
                              }
                              required
                              placeholder="გვერდი 1: დასაწყისი"
                              disabled={isUploading}
                              className="border-[var(--border)] bg-[var(--background)]"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block cursor-pointer">
                            <span className="mb-1 block text-[var(--muted-foreground)] text-xs">
                              თავის გვერდები *
                            </span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) =>
                                handleChapterFilesChange(chapter.id, e)
                              }
                              className="hidden"
                              disabled={isUploading}
                            />
                            <div className="flex justify-center rounded border-2 border-[var(--border)] border-dashed bg-[var(--background)] p-3 text-center transition-colors hover:border-[var(--accent)]">
                              {chapter.files.length === 0 ? (
                                <p className="text-center text-[var(--muted-foreground)] text-xs">
                                  აირჩიეთ გვერდები
                                </p>
                              ) : (
                                <p className="text-center text-xs">
                                  არჩეულია {chapter.files.length} ფაილი (
                                  {formatFileSize(
                                    chapter.files.reduce(
                                      (sum, f) => sum + f.size,
                                      0,
                                    ),
                                  )}
                                  )
                                </p>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddChapter}
                      disabled={isUploading}
                      className="w-full border-[var(--border)] hover:bg-[var(--muted)]"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        role="img"
                        aria-label="დამატება"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      დაამატე თავი
                    </Button>
                  </div>
                </>
              )}
            </Card>

            {/* Upload Progress */}
            {isUploading && (
              <Card className="border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{currentStep}</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                  <div
                    className="h-full bg-[var(--accent)] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                disabled={isUploading}
                loading={isUploading}
                className="flex-1 bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
              >
                {isUploading ? "იტვირთება..." : "მანგის შექმნა"}
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
