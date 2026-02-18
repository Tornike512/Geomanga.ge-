import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const coverPath = path.join("/");

    // Construct MangaDex cover URL
    const mangadexUrl = `https://uploads.mangadex.org/covers/${coverPath}`;

    // Fetch the image from MangaDex with proper headers
    const response = await fetch(mangadexUrl, {
      headers: {
        "User-Agent": "Geomanga.ge/1.0 (https://geomanga.ge)",
        Referer: "https://mangadex.org/",
        Accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
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
