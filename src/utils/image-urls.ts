export const getImageUrl = (path: string | undefined): string => {
  if (!path) return "/placeholder-manga.jpg";

  const staticUrl =
    process.env.NEXT_PUBLIC_STATIC_URL || "http://localhost:8000";

  // If path is already a full URL, return it
  if (path.startsWith("http")) return path;

  // Proxied MangaDex cover images via API route
  if (path.startsWith("/api/mangadex-cover/")) return path;

  // If path starts with /api/, use as-is (goes through Vercel proxy)
  if (path.startsWith("/api/")) return path;

  // If path starts with /uploads/, use base URL directly
  if (path.startsWith("/uploads/")) {
    return `${staticUrl}${path}`;
  }

  // Otherwise append to /uploads/
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${staticUrl}/uploads/${cleanPath}`;
};

export const getCoverUrl = (coverPath: string | undefined): string => {
  return getImageUrl(coverPath);
};

export const getAvatarUrl = (avatarPath: string | undefined): string => {
  if (!avatarPath) return "/default-avatar.jpg";
  return getImageUrl(avatarPath);
};
