import {
  RecentUpdatesSection,
  TrendingSection,
} from "@/features/manga/components";

export default async function Home() {
  return (
    <div className="container mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32 lg:px-12 lg:py-40">
      {/* Hero Section - Minimalist Dark with atmospheric depth */}
      <section className="mb-24 text-center md:mb-32">
        <h1 className="mb-6 font-semibold text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Geomanga
        </h1>
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
