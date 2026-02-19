"use client";

import { Check, ChevronDown, Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import {
  LIBRARY_CATEGORIES,
  type LibraryCategory,
} from "@/types/library.types";
import { cn } from "@/utils/cn";
import { useAddLibraryEntry } from "../hooks/use-add-library-entry";
import { useAddMangadexLibraryEntry } from "../hooks/use-add-mangadex-library-entry";
import { useMangaCategory } from "../hooks/use-manga-categories";
import { useMangadexMangaCategory } from "../hooks/use-mangadex-manga-category";
import { useRemoveLibraryEntry } from "../hooks/use-remove-library-entry";
import { useRemoveMangadexLibraryEntry } from "../hooks/use-remove-mangadex-library-entry";

interface LibraryDropdownProps {
  readonly mangaId?: number;
  readonly mangadexId?: string;
  readonly mangaTitle?: string;
  readonly coverImageUrl?: string | null;
  readonly className?: string;
}

export const LibraryDropdown = ({
  mangaId,
  mangadexId,
  mangaTitle,
  coverImageUrl,
  className,
}: LibraryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMangaDex = !!mangadexId;

  // Local manga hooks
  const { data: localCategoryData, isLoading: localLoading } = useMangaCategory(
    isMangaDex ? undefined : mangaId,
  );
  const addLocalEntry = useAddLibraryEntry();
  const removeLocalEntry = useRemoveLibraryEntry();

  // MangaDex manga hooks
  const { data: mangadexCategoryData, isLoading: mangadexLoading } =
    useMangadexMangaCategory(isMangaDex ? mangadexId : undefined);
  const addMangadexEntry = useAddMangadexLibraryEntry();
  const removeMangadexEntry = useRemoveMangadexLibraryEntry();

  const isLoading = isMangaDex ? mangadexLoading : localLoading;
  const currentCategory = isMangaDex
    ? (mangadexCategoryData?.category ?? null)
    : (localCategoryData?.category ?? null);

  const handleToggle = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleCategorySelect = useCallback(
    (category: LibraryCategory) => {
      if (currentCategory === category) {
        // Clicking the same category removes it
        if (isMangaDex) {
          removeMangadexEntry.mutate({
            mangadexMangaId: mangadexId as string,
            category,
          });
        } else {
          removeLocalEntry.mutate({ mangaId: mangaId as number, category });
        }
      } else {
        // Selecting a new category (API auto-removes from previous)
        if (isMangaDex) {
          addMangadexEntry.mutate({
            mangadex_manga_id: mangadexId as string,
            manga_title: mangaTitle as string,
            cover_image_url: coverImageUrl,
            category,
          });
        } else {
          addLocalEntry.mutate({ manga_id: mangaId as number, category });
        }
      }
    },
    [
      mangaId,
      mangadexId,
      mangaTitle,
      coverImageUrl,
      currentCategory,
      isMangaDex,
      addLocalEntry,
      removeLocalEntry,
      addMangadexEntry,
      removeMangadexEntry,
    ],
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPending = isMangaDex
    ? addMangadexEntry.isPending || removeMangadexEntry.isPending
    : addLocalEntry.isPending || removeLocalEntry.isPending;

  return (
    <div ref={dropdownRef} className={cn("relative inline-block", className)}>
      <Button
        variant={currentCategory ? "default" : "outline"}
        onClick={handleToggle}
        disabled={isLoading}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="gap-2 whitespace-nowrap"
      >
        {currentCategory === "favorites" && (
          <Heart className="h-4 w-4 fill-current" />
        )}
        <span>
          {currentCategory
            ? LIBRARY_CATEGORIES[currentCategory]
            : "სიაში დამატება"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </Button>

      {/* Dropdown Menu */}
      {/* biome-ignore lint/a11y/useSemanticElements: Custom dropdown menu with checkboxes requires div with role=listbox */}
      <div
        role="listbox"
        aria-label="ბიბლიოთეკის კატეგორიები"
        className={cn(
          "absolute right-0 z-[9999] mt-2 min-w-[200px] overflow-hidden rounded-[3px]",
          "border border-[var(--border)] bg-[var(--card-solid)] shadow-black/20 shadow-xl",
          "origin-top transition-all duration-200 ease-out",
          isOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0",
        )}
      >
        <div className="border-[var(--border)] border-b px-4 py-2">
          <span className="font-medium text-[var(--muted-foreground)] text-xs uppercase tracking-wider">
            დაამატე სიაში
          </span>
        </div>

        {(Object.keys(LIBRARY_CATEGORIES) as LibraryCategory[]).map(
          (category) => {
            const isSelected = currentCategory === category;
            const label = LIBRARY_CATEGORIES[category];

            return (
              // biome-ignore lint/a11y/useSemanticElements: Custom radio option in dropdown requires button with role=option
              <Button
                variant="unstyled"
                key={category}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleCategorySelect(category)}
                disabled={isPending}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm",
                  "transition-all duration-150 ease-out",
                  "text-[var(--foreground)]",
                  "hover:bg-[var(--accent-muted)]",
                  isPending && "pointer-events-none opacity-50",
                )}
              >
                <span>{label}</span>
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-150",
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                      : "border-[var(--border)]",
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
              </Button>
            );
          },
        )}
      </div>
    </div>
  );
};
