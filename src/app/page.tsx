import Link from "next/link";
import { Button } from "@/components/button";
import {
  RecentUpdatesSection,
  TrendingSection,
} from "@/features/manga/components";

export default async function Home() {
  return (
    <div className="container mx-auto max-w-[1920px] px-6 py-8 md:px-8 md:py-8 lg:px-12 lg:py-8">
      {/* Hero Section - Minimalist Dark with atmospheric depth */}
      <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-[var(--muted-foreground)] text-lg leading-relaxed md:text-xl">
          აღმოაჩინეთ ათასობით მანგის სერიები. წაიკითხეთ, შეაფასეთ და განიხილეთ
          თქვენი რჩეულები.
        </p>
        <Link href="/upload/manga">
          <Button size="lg" className="whitespace-nowrap">
            მანგის ატვირთვა
          </Button>
        </Link>
      </section>

      <TrendingSection />
      <RecentUpdatesSection />
    </div>
  );
}
