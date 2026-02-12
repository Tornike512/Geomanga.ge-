export interface AuthorResult {
  id: string;
  name: string;
}

export const getAuthors = async (query: string): Promise<AuthorResult[]> => {
  if (!query.trim()) return [];

  const res = await fetch(
    `/api/mangadex-author?name=${encodeURIComponent(query)}`,
  );

  if (!res.ok) return [];

  return (await res.json()) as AuthorResult[];
};
