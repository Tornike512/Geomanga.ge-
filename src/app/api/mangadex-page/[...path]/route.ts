import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    // path = ["hostname", "quality", "hash", "filename.jpg"]
    const mangadexUrl = `https://${path.join("/")}`;

    const response = await fetch(mangadexUrl, {
      headers: {
        "User-Agent": "Geomanga.ge/1.0 (https://geomanga.ge)",
        Referer: "https://mangadex.org/",
        Accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Internal Server Error: ${errorMessage}`, {
      status: 500,
    });
  }
}
