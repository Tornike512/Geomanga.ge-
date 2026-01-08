"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Dropdown } from "@/components/dropdown";
import { Input } from "@/components/input";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useGenres } from "@/features/genres/hooks/use-genres";
import { useCreateManga } from "@/features/manga/hooks/use-create-manga";
import { useUploadCover } from "@/features/upload/hooks/use-upload-cover";
import type { MangaStatus } from "@/types/manga.types";
import { UserRole } from "@/types/user.types";
import { validateCoverImage } from "@/utils/file-validation";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First create manga
      const manga = await createManga.mutateAsync({
        title: formData.title,
        description: formData.description,
        author: formData.author,
        artist: formData.artist,
        status: formData.status,
        genre_ids: formData.genreIds,
        cover_image_url: "",
      });

      // Then upload cover if provided
      if (coverFile) {
        try {
          await uploadCover.mutateAsync({ file: coverFile, mangaId: manga.id });
        } catch {
          alert("მანგა შეიქმნა, მაგრამ ყდის სურათის ატვირთვა ვერ მოხერხდა");
        }
      }

      // Navigate to manga page
      router.push(`/manga/${manga.slug}`);
    } catch {
      alert("მანგის შექმნა ვერ მოხერხდა");
    }
  };

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
                ყდის სურათი
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
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => {
                    const input = document.querySelector(
                      'input[type="file"]',
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
                    ალტერნატიული სათაური
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
                      მხატვარი
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

            {/* Submit Button */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                disabled={createManga.isPending || uploadCover.isPending}
                loading={createManga.isPending || uploadCover.isPending}
                className="flex-1 bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
              >
                {createManga.isPending || uploadCover.isPending
                  ? "იტვირთება..."
                  : "მანგის შექმნა"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
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
