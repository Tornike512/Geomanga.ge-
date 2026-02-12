export const getAuthors = async (query: string): Promise<string[]> => {
  if (!query.trim()) return [];

  const res = await fetch(
    `/api/mangadex-author?name=${encodeURIComponent(query)}`,
  );

  if (!res.ok) return [];

  return (await res.json()) as string[];
};
