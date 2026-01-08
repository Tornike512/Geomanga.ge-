import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import {
  RecentUpdatesSection,
  TrendingSection,
} from "@/features/manga/components";

export default async function Home() {
  return (
    <div className="container mx-auto max-w-[1920px] px-6 py-24 md:px-8 md:py-32 lg:px-12 lg:py-40">
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
          აღმოაჩინეთ ათასობით მანგის სერიები. წაიკითხეთ, შეაფასეთ და განიხილეთ
          თქვენი რჩეულები.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/upload/manga">
            <Button size="lg">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              მანგის ატვირთვა
            </Button>
          </Link>
        </div>
      </section>

      <TrendingSection />
      <RecentUpdatesSection />
    </div>
  );
}
