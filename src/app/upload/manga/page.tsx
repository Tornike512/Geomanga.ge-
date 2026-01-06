"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useGenres } from "@/features/genres/hooks/use-genres";
import { useCreateManga } from "@/features/manga/hooks/use-create-manga";
import { useUploadCover } from "@/features/upload/hooks/use-upload-cover";
import type { MangaStatus } from "@/types/manga";

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
    status: "ONGOING" as MangaStatus,
    releaseYear: new Date().getFullYear(),
    genreIds: [] as number[],
  });

  // Check if user has permission
  if (user && user.role !== "UPLOADER" && user.role !== "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 font-bold text-2xl">Access Denied</h1>
        <p className="text-gray-600">
          You need uploader permissions to access this page
        </p>
      </div>
    );
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

    // First upload cover if provided
    let coverImageUrl = "";
    if (coverFile) {
      try {
        const uploadResult = await uploadCover.mutateAsync(coverFile);
        coverImageUrl = uploadResult.url;
      } catch (_error) {
        alert("Failed to upload cover image");
        return;
      }
    }

    // Then create manga
    createManga.mutate(
      {
        ...formData,
        coverImage: coverImageUrl,
      },
      {
        onSuccess: (manga) => {
          router.push(`/manga/${manga.slug}`);
        },
      },
    );
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Upload New Manga</h1>
        <p className="text-gray-600">Add a new manga series to the platform</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Cover Image */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="mb-4 font-bold">Cover Image</h3>
              <div className="mb-4 aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg
                        className="mx-auto mb-2 h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-label="Upload image"
                        role="img"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">No cover image</p>
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
                  className="w-full"
                  asChild
                >
                  <span className="cursor-pointer">
                    {coverPreview ? "Change Cover" : "Upload Cover"}
                  </span>
                </Button>
              </label>
            </Card>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6">
              <h3 className="mb-4 font-bold">Basic Information</h3>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-1 block font-medium text-sm"
                  >
                    Title *
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
                    placeholder="Enter manga title"
                  />
                </div>

                {/* Alternative Title */}
                <div>
                  <label
                    htmlFor="alternativeTitle"
                    className="mb-1 block font-medium text-sm"
                  >
                    Alternative Title
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
                    placeholder="Alternative or Japanese title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-1 block font-medium text-sm"
                  >
                    Description *
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter manga description..."
                  />
                </div>

                {/* Author & Artist */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="author"
                      className="mb-1 block font-medium text-sm"
                    >
                      Author *
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
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="artist"
                      className="mb-1 block font-medium text-sm"
                    >
                      Artist
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
                    />
                  </div>
                </div>

                {/* Status & Release Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="status"
                      className="mb-1 block font-medium text-sm"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as MangaStatus,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ONGOING">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="HIATUS">Hiatus</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="releaseYear"
                      className="mb-1 block font-medium text-sm"
                    >
                      Release Year *
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
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Genres */}
            <Card className="p-6">
              <h3 className="mb-4 font-bold">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres?.map((genre) => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => handleGenreToggle(genre.id)}
                  >
                    <Badge
                      variant={
                        formData.genreIds.includes(genre.id)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer transition-transform hover:scale-105"
                    >
                      {genre.name}
                    </Badge>
                  </button>
                ))}
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createManga.isPending || uploadCover.isPending}
                loading={createManga.isPending || uploadCover.isPending}
                className="flex-1"
              >
                {createManga.isPending || uploadCover.isPending
                  ? "Uploading..."
                  : "Create Manga"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
