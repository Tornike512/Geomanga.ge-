"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";

export interface DropdownOption {
  readonly value: string;
  readonly label: string;
}

export interface DropdownProps {
  readonly options: readonly DropdownOption[];
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly "aria-label"?: string;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
  id,
  "aria-label": ariaLabel,
}: DropdownProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleToggle = useCallback((): void => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleSelect = useCallback(
    (optionValue: string): void => {
      onChange(optionValue);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex].value);
          } else {
            setIsOpen(true);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : options.length - 1,
            );
          }
          break;
        case "Home":
          e.preventDefault();
          setHighlightedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, handleSelect],
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
      const highlightedElement = listboxRef.current.children[
        highlightedIndex
      ] as HTMLElement | undefined;
      highlightedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, highlightedIndex]);

  const listboxId = id ? `${id}-listbox` : undefined;

  return (
    <div ref={dropdownRef} className={cn("relative inline-block", className)}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        id={id}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          // Base styles
          "inline-flex w-full cursor-pointer items-center justify-between gap-2 font-medium text-sm tracking-normal",
          "rounded-lg border px-4 py-2.5",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          // Default state - glass effect
          "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] backdrop-blur-sm",
          // Hover state
          "hover:border-[var(--border-hover)] hover:bg-[var(--card)]",
          // Open state
          isOpen && [
            "border-[var(--accent)]/50",
            "ring-2 ring-[var(--accent)]/20",
            "bg-[var(--muted)]",
          ],
          // Disabled state
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <span
          className={cn(
            "whitespace-nowrap",
            !selectedOption && "text-[var(--muted-foreground)]",
          )}
        >
          {selectedOption?.label || placeholder}
        </span>

        {/* Chevron Icon with rotation animation */}
        <svg
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-transform duration-200 ease-out",
            isOpen && "rotate-180 text-[var(--accent)]",
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {/* Dropdown Menu */}
      {/* biome-ignore lint/a11y/useSemanticElements: Custom dropdown requires div with role=listbox for proper ARIA implementation */}
      <div
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-label={ariaLabel}
        className={cn(
          // Base styles
          "absolute left-0 z-[9999] mt-2 w-full overflow-hidden rounded-lg",
          "border border-[var(--border)] bg-[var(--card-solid)] shadow-black/20 shadow-xl backdrop-blur-md",
          // Animation styles
          "origin-top transition-all duration-200 ease-out",
          isOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0",
          // Max height with scroll
          "max-h-60 overflow-y-auto",
        )}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isHighlighted = index === highlightedIndex;

          return (
            // biome-ignore lint/a11y/useSemanticElements: Custom dropdown option requires div with role=option for ARIA compliance
            <div
              key={option.value}
              role="option"
              tabIndex={-1}
              aria-selected={isSelected}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(option.value);
                }
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              className={cn(
                // Base styles
                "flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm",
                "transition-all duration-150 ease-out",
                // Default state
                "text-[var(--foreground)]",
                // Highlighted/Hover state
                (isHighlighted || isSelected) && [
                  "bg-[var(--accent-muted)]",
                  isSelected && "text-[var(--accent)]",
                ],
                // Selected state indicator
                isSelected && "font-medium",
              )}
            >
              <span className="whitespace-nowrap">{option.label}</span>

              {/* Checkmark for selected option */}
              {isSelected && (
                <svg
                  className="h-4 w-4 shrink-0 text-[var(--accent)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
