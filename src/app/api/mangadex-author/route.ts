import { type NextRequest, NextResponse } from "next/server";

interface MangaDexAuthor {
  id: string;
  attributes: {
    name: string;
  };
}

interface MangaDexAuthorResponse {
  data: MangaDexAuthor[];
}

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `https://api.mangadex.org/author?name=${encodeURIComponent(name)}&limit=10`,
      {
        headers: {
          "User-Agent": "Geomanga.ge/1.0 (https://geomanga.ge)",
        },
      },
    );

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const json = (await res.json()) as MangaDexAuthorResponse;
    const authors = json.data.map((author) => ({
      id: author.id,
      name: author.attributes.name,
    }));

    return NextResponse.json(authors);
  } catch {
    return NextResponse.json([]);
  }
}
