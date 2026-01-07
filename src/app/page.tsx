import Image from "next/image";
import {
  RecentUpdatesSection,
  TrendingSection,
} from "@/features/manga/components";

export default async function Home() {
  return (
    <div className="container mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32 lg:px-12 lg:py-40">
      {/* Hero Section - Minimalist Dark with atmospheric depth */}
      <section className="mb-24 text-center md:mb-32">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/geomanga-logo.png"
            alt="Geomanga"
            width={480}
            height={160}
            className="h-40 w-auto md:h-48"
            priority
          />
        </div>
        <p className="mx-auto max-w-2xl text-[var(--muted-foreground)] text-lg leading-relaxed md:text-xl">
          Discover thousands of manga series. Read, rate, and discuss your
          favorites.
        </p>
      </section>

      <TrendingSection />
      <RecentUpdatesSection />
    </div>
  );
}
