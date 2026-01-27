import { useQuery } from "@tanstack/react-query";

interface MangaDexManga {
  id: string;
  type: "manga";
  attributes: {
    title: Record<string, string>;
    description: Record<string, string>;
    status: string;
    year: number | null;
    tags: { id: string; attributes: { name: Record<string, string> } }[];
  };
  relationships: {
    id: string;
    type: string;
    attributes?: { fileName?: string; name?: string };
  }[];
}

interface TransformedManga {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  status: string;
  year: number | null;
  author: string | null;
}

const fetchMangaDex = async (limit = 10): Promise<TransformedManga[]> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    "includes[]": "cover_art",
    "contentRating[]": "safe",
    "order[followedCount]": "desc",
  });
  params.append("includes[]", "author");

  const response = await fetch(`https://api.mangadex.org/manga?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch from MangaDex");
  }

  const data = await response.json();

  return data.data.map((manga: MangaDexManga): TransformedManga => {
    const title =
      manga.attributes.title.en ||
      manga.attributes.title["ja-ro"] ||
      Object.values(manga.attributes.title)[0] ||
      "Unknown";

    const description =
      manga.attributes.description.en ||
      Object.values(manga.attributes.description)[0] ||
      "";

    const coverRel = manga.relationships.find((r) => r.type === "cover_art");
    const coverUrl = coverRel?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.256.jpg`
      : null;

    const authorRel = manga.relationships.find((r) => r.type === "author");
    const author = authorRel?.attributes?.name || null;

    return {
      id: manga.id,
      title,
      description,
      coverUrl,
      status: manga.attributes.status,
      year: manga.attributes.year,
      author,
    };
  });
};

export const useFetchMangaDex = (limit = 10) => {
  return useQuery({
    queryKey: ["mangadex-fetch", limit],
    queryFn: () => fetchMangaDex(limit),
    staleTime: 60 * 60 * 1000,
  });
};
