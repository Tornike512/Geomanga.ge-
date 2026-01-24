import type {
  MangaDexAuthorAttributes,
  MangaDexCoverArtAttributes,
  MangaDexListParams,
  MangaDexManga,
  MangaDexResponse,
  MangaDexTransformedManga,
} from "@/types/mangadex.types";

const MANGADEX_API_URL = "https://api.mangadex.org";

const buildMangaDexUrl = (params: MangaDexListParams): string => {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.offset) searchParams.set("offset", params.offset.toString());
  if (params.title) searchParams.set("title", params.title);

  // Add includes for relationships
  const includes = params.includes || ["cover_art", "author", "artist"];
  for (const include of includes) {
    searchParams.append("includes[]", include);
  }

  // Content rating filter (default to safe and suggestive)
  const contentRating = params.contentRating || ["safe", "suggestive"];
  for (const rating of contentRating) {
    searchParams.append("contentRating[]", rating);
  }

  // Status filter
  if (params.status) {
    for (const status of params.status) {
      searchParams.append("status[]", status);
    }
  }

  // Order by latest updated or follow count
  if (params.order) {
    for (const [key, value] of Object.entries(params.order)) {
      searchParams.set(`order[${key}]`, value);
    }
  }

  return `${MANGADEX_API_URL}/manga?${searchParams.toString()}`;
};

const getCoverImageUrl = (manga: MangaDexManga): string | undefined => {
  const coverRelationship = manga.relationships.find(
    (rel) => rel.type === "cover_art",
  );
  if (coverRelationship?.attributes) {
    const coverAttrs =
      coverRelationship.attributes as MangaDexCoverArtAttributes;
    return `https://uploads.mangadex.org/covers/${manga.id}/${coverAttrs.fileName}.256.jpg`;
  }
  return undefined;
};

const getAuthorName = (manga: MangaDexManga): string | undefined => {
  const authorRelationship = manga.relationships.find(
    (rel) => rel.type === "author",
  );
  if (authorRelationship?.attributes) {
    return (authorRelationship.attributes as MangaDexAuthorAttributes).name;
  }
  return undefined;
};

const getArtistName = (manga: MangaDexManga): string | undefined => {
  const artistRelationship = manga.relationships.find(
    (rel) => rel.type === "artist",
  );
  if (artistRelationship?.attributes) {
    return (artistRelationship.attributes as MangaDexAuthorAttributes).name;
  }
  return undefined;
};

const getTitle = (manga: MangaDexManga): string => {
  const titles = manga.attributes.title;
  // Priority: English > Romanized Japanese > Japanese > Any available
  return (
    titles.en ||
    titles["ja-ro"] ||
    titles.ja ||
    Object.values(titles)[0] ||
    "Unknown Title"
  );
};

const getDescription = (manga: MangaDexManga): string | undefined => {
  const descriptions = manga.attributes.description;
  return (
    descriptions.en || descriptions["ja-ro"] || Object.values(descriptions)[0]
  );
};

const createSlug = (title: string, id: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
  return `${slug}-${id.slice(0, 8)}`;
};

export const transformMangaDexManga = (
  manga: MangaDexManga,
): MangaDexTransformedManga => {
  const title = getTitle(manga);

  return {
    id: manga.id,
    title,
    slug: createSlug(title, manga.id),
    description: getDescription(manga),
    cover_image_url: getCoverImageUrl(manga),
    status: manga.attributes.status,
    content_rating: manga.attributes.contentRating,
    author: getAuthorName(manga),
    artist: getArtistName(manga),
    year: manga.attributes.year,
    tags: manga.attributes.tags.map((tag) => ({
      id: tag.id,
      name:
        tag.attributes.name.en ||
        Object.values(tag.attributes.name)[0] ||
        "Unknown",
    })),
    original_language: manga.attributes.originalLanguage,
    mangadex_id: manga.id,
  };
};

export const getMangaDexManga = async (
  params: MangaDexListParams = {},
): Promise<MangaDexTransformedManga[]> => {
  const defaultParams: MangaDexListParams = {
    limit: 10,
    offset: 0,
    includes: ["cover_art", "author", "artist"],
    contentRating: ["safe", "suggestive"],
    order: { followedCount: "desc" },
    ...params,
  };

  const url = buildMangaDexUrl(defaultParams);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(
      `MangaDex API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as MangaDexResponse<MangaDexManga[]>;

  if (data.result !== "ok") {
    throw new Error("MangaDex API returned an error");
  }

  return data.data.map(transformMangaDexManga);
};

export const getMangaDexPopular = async (): Promise<
  MangaDexTransformedManga[]
> => {
  return getMangaDexManga({
    limit: 10,
    order: { followedCount: "desc" },
  });
};

export const getMangaDexLatest = async (): Promise<
  MangaDexTransformedManga[]
> => {
  return getMangaDexManga({
    limit: 10,
    order: { latestUploadedChapter: "desc" },
  });
};

export const searchMangaDex = async (
  title: string,
): Promise<MangaDexTransformedManga[]> => {
  return getMangaDexManga({
    limit: 20,
    title,
  });
};
