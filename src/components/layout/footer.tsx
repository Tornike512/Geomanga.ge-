import { BookOpen } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-[#3F3F46] border-t-2 bg-[#09090B]">
      <div className="container mx-auto max-w-[95vw] px-8 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <h3 className="mb-6 flex items-center gap-2 font-bold text-2xl uppercase tracking-tighter">
              <BookOpen className="h-6 w-6 text-[#DFE104]" />
              GEOMANGA
            </h3>
            <p className="text-[#A1A1AA] text-lg leading-tight">
              Your ultimate destination for reading manga online. Discover new
              series and follow your favorites.
            </p>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-[#DFE104] text-sm uppercase tracking-widest">
              BROWSE
            </h4>
            <ul className="space-y-3 text-[#A1A1AA]">
              <li>
                <Link
                  href="/trending"
                  className="transition-colors hover:text-[#FAFAFA]"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/recent"
                  className="transition-colors hover:text-[#FAFAFA]"
                >
                  Recent Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/genres"
                  className="transition-colors hover:text-[#FAFAFA]"
                >
                  All Genres
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-[#DFE104] text-sm uppercase tracking-widest">
              COMMUNITY
            </h4>
            <ul className="space-y-3 text-[#A1A1AA]">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-[#FAFAFA]"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-[#FAFAFA]"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="transition-colors hover:text-[#FAFAFA]"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-[#DFE104] text-sm uppercase tracking-widest">
              LEGAL
            </h4>
            <ul className="space-y-3 text-[#A1A1AA]">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-[#FAFAFA]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-[#FAFAFA]"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/dmca"
                  className="transition-colors hover:text-[#FAFAFA]"
                >
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-[#3F3F46] border-t-2 pt-8 text-center text-[#A1A1AA] text-sm uppercase tracking-widest">
          <p>&copy; 2026 GEOMANGA.GE. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
