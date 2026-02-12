interface MangaDexAuthor {
  attributes: {
    name: string;
  };
}

interface MangaDexAuthorResponse {
  data: MangaDexAuthor[];
}

export const getAuthors = async (query: string): Promise<string[]> => {
  if (!query.trim()) return [];

  const res = await fetch(
    `https://api.mangadex.org/author?name=${encodeURIComponent(query)}&limit=10`,
  );

  if (!res.ok) return [];

  const json: MangaDexAuthorResponse = await res.json();
  return json.data.map((author) => author.attributes.name);
};
