import {
  RecentUpdatesSection,
  TrendingSection,
} from "@/features/manga/components";

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16 text-center">
        <h1 className="mb-4 font-bold text-5xl text-gray-900 md:text-6xl">
          Welcome to Geomanga.ge
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 text-xl">
          Discover thousands of manga series. Read, rate, and discuss your
          favorites.
        </p>
      </section>

      <TrendingSection />
      <RecentUpdatesSection />
    </div>
  );
}
