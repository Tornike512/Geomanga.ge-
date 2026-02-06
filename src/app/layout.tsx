import type { Metadata } from "next";
import "../styles/globals.css";
import { Footer, Header } from "@/components/layout";
import { NoiseTexture } from "@/components/noise-texture";
import { AppProviders } from "@/providers";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "Geomanga.ge - Read Manga Online",
  description:
    "Your ultimate destination for reading manga online. Discover new series and follow your favorites.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full")}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400..700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/genfavicon-64.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/genfavicon-64.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/genfavicon-64.png"
        />
      </head>
      <body className={cn("min-h-screen antialiased")}>
        <NoiseTexture />
        <AppProviders>
          <div className="mx-auto flex min-h-screen w-full max-w-[1920px] flex-col">
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
