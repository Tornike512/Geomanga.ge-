import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-[var(--border)] border-t bg-[var(--background)]">
      <div className="container mx-auto max-w-[1920px] px-6 pt-6 pb-2">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="mb-4">
              <Image
                src="/images/geomanga-logo.png"
                alt="Geomanga"
                width={240}
                height={80}
                className="h-16 w-auto"
              />
            </div>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
              Your ultimate destination for reading manga online. Discover new
              series and follow your favorites.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-[var(--foreground)] text-sm">
              Browse
            </h4>
            <ul className="space-y-2 text-[var(--muted-foreground)] text-sm">
              <li>
                <Link
                  href="/trending"
                  className="transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/recent"
                  className="transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                >
                  Recent Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/genres"
                  className="transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                >
                  All Genres
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-[var(--foreground)] text-sm">
              Community
            </h4>
            <ul className="space-y-2 text-[var(--muted-foreground)] text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-[var(--foreground)] text-sm">
              Legal
            </h4>
            <ul className="space-y-2 text-[var(--muted-foreground)] text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/dmca"
                  className="transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
                >
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex w-full justify-center border-[var(--border)] border-t pt-2 text-center text-[var(--muted-foreground)] text-sm">
          <p>&copy; 2026 Geomanga.ge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
