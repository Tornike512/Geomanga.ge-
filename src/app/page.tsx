import { UploadLink } from "@/components/upload-link";
import {
  MangaDexSection,
  RecentUpdatesSection,
  TrendingSection,
} from "@/features/manga/components";

export default async function Home() {
  return (
    <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-2 py-8 sm:px-4 md:px-8 md:py-12">
      {/* Hero Section - Minimalist Dark with atmospheric depth */}
      <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-[var(--muted-foreground)] text-lg leading-relaxed md:text-xl">
          აღმოაჩინეთ ათასობით მანგის სერიები. წაიკითხეთ, შეაფასეთ და განიხილეთ
          თქვენი რჩეულები.
        </p>
        <UploadLink />
      </section>

      <TrendingSection />
      <MangaDexSection />
      <RecentUpdatesSection />
    </div>
  );
}
