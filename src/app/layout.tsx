import type { Metadata } from "next";
import "../styles/globals.css";
import { Footer, Header } from "@/components/layout";
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
      <body className={cn("min-h-screen bg-gray-50 font-roboto text-gray-900")}>
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
