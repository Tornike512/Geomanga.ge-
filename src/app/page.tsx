import {
  RecentUpdatesSection,
  TrendingSection,
} from "@/features/manga/components";

export default async function Home() {
  return (
    <div className="container mx-auto max-w-[95vw] px-8 py-20 md:py-32">
      {/* Hero Section - Kinetic Typography */}
      <section className="mb-32 text-center">
        <h1 className="mb-8 font-bold text-[clamp(3rem,12vw,14rem)] uppercase leading-[0.85] tracking-tighter">
          GEOMANGA
        </h1>
        <p className="mx-auto max-w-3xl text-2xl text-[#A1A1AA] leading-tight md:text-3xl">
          Discover thousands of manga series. Read, rate, and discuss your
          favorites.
        </p>
      </section>

      <TrendingSection />
      <RecentUpdatesSection />
    </div>
  );
}
