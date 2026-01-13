import Image from "next/image";
import { useMemo } from "react";
import { getAvatarUrl } from "@/utils/image-urls";

interface AvatarProps {
  readonly src?: string;
  readonly alt: string;
  readonly size?: "sm" | "md" | "lg" | "xl";
  readonly className?: string;
}

const sizeMap = {
  sm: { width: 32, height: 32, className: "h-8 w-8" },
  md: { width: 40, height: 40, className: "h-10 w-10" },
  lg: { width: 64, height: 64, className: "h-16 w-16" },
  xl: { width: 100, height: 100, className: "h-25 w-25" },
} as const;

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const { width, height, className: sizeClass } = sizeMap[size];
  const avatarUrl = getAvatarUrl(src);

  // Add cache-busting parameter only when src changes
  const urlWithCacheBust = useMemo(() => {
    return src ? `${avatarUrl}?t=${Date.now()}` : avatarUrl;
  }, [src, avatarUrl]);

  return (
    <div
      className={`${sizeClass} ${className} relative shrink-0 overflow-hidden rounded-full bg-[var(--muted)]`}
    >
      <Image
        src={urlWithCacheBust}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover"
        priority={false}
        unoptimized
      />
    </div>
  );
}
