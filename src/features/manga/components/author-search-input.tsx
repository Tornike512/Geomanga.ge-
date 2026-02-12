"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/input";
import { useDebounce } from "@/hooks";
import { cn } from "@/utils/cn";
import { useAuthors } from "../hooks/use-authors";

interface AuthorSearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly id?: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly className?: string;
  readonly disabled?: boolean;
}

export const AuthorSearchInput = ({
  value,
  onChange,
  id,
  placeholder = "ავტორის სახელი",
  required,
  className,
  disabled,
}: AuthorSearchInputProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(value, 300);
  const { data: authorResults = [] } = useAuthors(debouncedQuery);
  const authors = authorResults.map((a) => a.name);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const el = listboxRef.current.children[highlightedIndex] as
        | HTMLElement
        | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, highlightedIndex]);

  const handleSelect = useCallback(
    (author: string): void => {
      onChange(author);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (!isOpen || authors.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < authors.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : authors.length - 1,
          );
          break;
        case "Enter":
          if (highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(authors[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [isOpen, authors, highlightedIndex, handleSelect],
  );

  const listboxId = id ? `${id}-listbox` : undefined;

  return (
    <div ref={containerRef} className="relative">
      {/* biome-ignore lint/a11y/useSemanticElements: Input with combobox role provides better UX than select for autocomplete */}
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        role="combobox"
        aria-expanded={isOpen && authors.length > 0}
        aria-autocomplete="list"
        aria-controls={listboxId}
        autoComplete="off"
      />

      {/* biome-ignore lint/a11y/useSemanticElements: Custom dropdown requires div with role=listbox for proper ARIA implementation */}
      <div
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        className={cn(
          "absolute left-0 z-[9999] mt-1 w-full overflow-hidden rounded-lg",
          "border border-[var(--border)] bg-[var(--card-solid)] shadow-black/20 shadow-xl backdrop-blur-md",
          "origin-top transition-all duration-200 ease-out",
          isOpen && authors.length > 0
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0",
          "max-h-60 overflow-y-auto",
        )}
      >
        {authors.map((author, index) => {
          const isHighlighted = index === highlightedIndex;
          const isSelected = author === value;

          return (
            // biome-ignore lint/a11y/useSemanticElements: Custom dropdown option requires div with role=option for ARIA compliance
            <div
              key={author}
              role="option"
              tabIndex={-1}
              aria-selected={isSelected}
              onClick={() => handleSelect(author)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(author);
                }
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              className={cn(
                "flex cursor-pointer items-center px-4 py-2.5 text-base",
                "transition-all duration-150 ease-out",
                "text-[var(--foreground)]",
                (isHighlighted || isSelected) && "bg-[var(--accent-muted)]",
                isSelected && "font-medium text-[var(--accent)]",
              )}
            >
              {author}
            </div>
          );
        })}
      </div>
    </div>
  );
};
