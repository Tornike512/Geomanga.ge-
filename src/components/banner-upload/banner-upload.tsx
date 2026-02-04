"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/button";

interface BannerUploadProps {
  readonly onFileSelect: (file: File | undefined) => void;
  readonly error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function BannerUpload({ onFileSelect, error }: BannerUploadProps) {
  const [preview, setPreview] = useState<string | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | undefined => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "მხოლოდ JPG, PNG ან WebP ფორმატის სურათები დაშვებულია";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს";
    }

    return undefined;
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);

    if (error) {
      setValidationError(error);
      setPreview(undefined);
      onFileSelect(undefined);
      return;
    }

    setValidationError(undefined);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(undefined);
    setValidationError(undefined);
    onFileSelect(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayError = validationError || error;

  return (
    <div>
      <label
        htmlFor="banner-upload"
        className="mb-2 block text-[var(--muted-foreground)] text-sm"
      >
        ბანერის სურათი{" "}
        <span className="text-[var(--muted-foreground)] text-xs">
          (არასავალდებულო)
        </span>
      </label>

      <Button
        variant="ghost"
        className={`relative flex h-auto w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragging
            ? "border-[var(--accent)] bg-[var(--accent)]/5"
            : displayError
              ? "border-red-500/30 bg-red-500/5"
              : "border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-transparent"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          id="banner-upload"
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="flex w-full flex-col items-center gap-4">
            <div className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-[var(--accent)]">
              <Image
                src={preview}
                alt="Banner preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="rounded-md bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-400"
            >
              წაშლა
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <svg
              className="h-12 w-12 text-[var(--muted-foreground)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Upload icon"
            >
              <title>Upload icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-[var(--foreground)] text-sm">
                {isDragging
                  ? "ჩააგდეთ ბანერი აქ"
                  : "დააჭირეთ ან ჩააგდეთ ბანერის სურათი"}
              </p>
              <p className="mt-1 text-[var(--muted-foreground)] text-xs">
                JPG, PNG, WebP (მაქს. 5MB) - რეკომენდებული ზომა: 1920x400px
              </p>
            </div>
          </div>
        )}
      </Button>

      {displayError && (
        <p className="mt-2 text-red-400 text-sm">{displayError}</p>
      )}

      {!preview && !displayError && (
        <p className="mt-2 text-[var(--muted-foreground)] text-xs">
          შეგიძლიათ გამოტოვოთ ეს ნაბიჯი და დაამატოთ ბანერი მოგვიანებით
        </p>
      )}
    </div>
  );
}
