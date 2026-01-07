export const getImageUrl = (path: string | undefined): string => {
  if (!path) return "/placeholder-manga.jpg";

  const staticUrl =
    process.env.NEXT_PUBLIC_STATIC_URL || "http://localhost:8000/uploads";

  // If path is already a full URL, return it
  if (path.startsWith("http")) return path;

  // If path already includes /uploads/, use base URL without /uploads
  if (path.startsWith("/uploads/")) {
    const baseUrl = staticUrl.replace(/\/uploads\/?$/, "");
    return `${baseUrl}${path}`;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${staticUrl}/${cleanPath}`;
};

export const getCoverUrl = (coverPath: string | undefined): string => {
  return getImageUrl(coverPath);
};

export const getAvatarUrl = (avatarPath: string | undefined): string => {
  if (!avatarPath) return "/default-avatar.jpg";
  return getImageUrl(avatarPath);
};
