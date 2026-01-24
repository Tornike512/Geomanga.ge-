import type {
  MangaDexAuthorAttributes,
  MangaDexBrowseParams,
  MangaDexChapter,
  MangaDexChapterPages,
  MangaDexCoverArtAttributes,
  MangaDexListParams,
  MangaDexManga,
  MangaDexPaginatedResponse,
  MangaDexResponse,
  MangaDexTransformedChapter,
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

  // Available translated language filter
  if (params.availableTranslatedLanguage) {
    for (const lang of params.availableTranslatedLanguage) {
      searchParams.append("availableTranslatedLanguage[]", lang);
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
    available_languages: manga.attributes.availableTranslatedLanguages || [],
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
    availableTranslatedLanguage: ["en"], // Only show manga with English translations
  });
};

export const getMangaDexLatest = async (): Promise<
  MangaDexTransformedManga[]
> => {
  return getMangaDexManga({
    limit: 10,
    order: { latestUploadedChapter: "desc" },
    availableTranslatedLanguage: ["en"], // Only show manga with English translations
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

// Browse with pagination support
export const browseMangaDex = async (
  params: MangaDexBrowseParams = {},
): Promise<MangaDexPaginatedResponse> => {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const offset = (page - 1) * limit;

  const searchParams = new URLSearchParams();
  searchParams.set("limit", limit.toString());
  searchParams.set("offset", offset.toString());

  // Add includes for relationships
  searchParams.append("includes[]", "cover_art");
  searchParams.append("includes[]", "author");
  searchParams.append("includes[]", "artist");

  // Title search
  if (params.title) {
    searchParams.set("title", params.title);
  }

  // Status filter
  if (params.status) {
    searchParams.append("status[]", params.status);
  }

  // Content rating
  if (params.contentRating) {
    searchParams.append("contentRating[]", params.contentRating);
  } else {
    // Default to safe and suggestive
    searchParams.append("contentRating[]", "safe");
    searchParams.append("contentRating[]", "suggestive");
  }

  // Demographic
  if (params.demographic) {
    searchParams.append("publicationDemographic[]", params.demographic);
  }

  // Original language
  if (params.originalLanguage) {
    searchParams.append("originalLanguage[]", params.originalLanguage);
  }

  // Available translated language (filter manga that have chapters in this language)
  if (params.availableTranslatedLanguage) {
    searchParams.append(
      "availableTranslatedLanguage[]",
      params.availableTranslatedLanguage,
    );
  }

  // Tags
  if (params.includedTags && params.includedTags.length > 0) {
    for (const tag of params.includedTags) {
      searchParams.append("includedTags[]", tag);
    }
  }

  // Sorting
  const sortField = params.sortBy || "followedCount";
  const sortOrder = params.orderDesc === false ? "asc" : "desc";
  searchParams.set(`order[${sortField}]`, sortOrder);

  const url = `https://api.mangadex.org/manga?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
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

  const total = data.total || 0;
  const pages = Math.ceil(total / limit);

  return {
    items: data.data.map(transformMangaDexManga),
    total,
    offset,
    limit,
    pages,
    page,
  };
};

// Fetch MangaDex tags for filtering
export const getMangaDexTags = async (): Promise<
  { id: string; name: string; group: string }[]
> => {
  const response = await fetch("https://api.mangadex.org/manga/tag", {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!response.ok) {
    throw new Error(`MangaDex API error: ${response.status}`);
  }

  const data = (await response.json()) as MangaDexResponse<
    {
      id: string;
      type: "tag";
      attributes: {
        name: Record<string, string>;
        group: string;
      };
    }[]
  >;

  if (data.result !== "ok") {
    throw new Error("MangaDex API returned an error");
  }

  return data.data.map((tag) => ({
    id: tag.id,
    name: tag.attributes.name.en || Object.values(tag.attributes.name)[0],
    group: tag.attributes.group,
  }));
};

// Fetch a single manga by ID
export const getMangaDexMangaById = async (
  mangaId: string,
): Promise<MangaDexTransformedManga> => {
  const url = `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `MangaDex API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as MangaDexResponse<MangaDexManga>;

  if (data.result !== "ok") {
    throw new Error("MangaDex API returned an error");
  }

  return transformMangaDexManga(data.data);
};

// Fetch chapters for a manga
export const getMangaDexChapters = async (
  mangaId: string,
  language = "en",
): Promise<MangaDexTransformedChapter[]> => {
  const chapters: MangaDexTransformedChapter[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.mangadex.org/manga/${mangaId}/feed?limit=${limit}&offset=${offset}&translatedLanguage[]=${language}&order[chapter]=asc&includes[]=scanlation_group`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.status}`);
    }

    const data = (await response.json()) as MangaDexResponse<MangaDexChapter[]>;

    if (data.result !== "ok") {
      throw new Error("MangaDex API returned an error");
    }

    for (const chapter of data.data) {
      const scanlationGroup = chapter.relationships.find(
        (r) => r.type === "scanlation_group",
      );

      chapters.push({
        id: chapter.id,
        chapter_number: chapter.attributes.chapter || "0",
        title: chapter.attributes.title,
        language: chapter.attributes.translatedLanguage,
        pages_count: chapter.attributes.pages,
        published_at: chapter.attributes.publishAt,
        scanlation_group:
          (scanlationGroup?.attributes as { name?: string } | undefined)
            ?.name || null,
        external_url: chapter.attributes.externalUrl || null,
      });
    }

    if (data.data.length < limit) {
      hasMore = false;
    } else {
      offset += limit;
    }

    // Safety limit to prevent infinite loops
    if (offset > 1000) {
      hasMore = false;
    }
  }

  return chapters;
};

// Fetch chapter pages
export const getMangaDexChapterPages = async (
  chapterId: string,
): Promise<string[]> => {
  const url = `https://api.mangadex.org/at-home/server/${chapterId}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`MangaDex API error: ${response.status}`);
  }

  const data = (await response.json()) as MangaDexChapterPages & {
    result: string;
  };

  if (data.result !== "ok") {
    throw new Error("MangaDex API returned an error");
  }

  // Use data-saver quality for faster loading
  return data.chapter.dataSaver.map(
    (filename) => `${data.baseUrl}/data-saver/${data.chapter.hash}/${filename}`,
  );
};
