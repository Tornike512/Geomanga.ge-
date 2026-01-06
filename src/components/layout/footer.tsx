import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-bold text-lg">📖 Geomanga.ge</h3>
            <p className="text-gray-600 text-sm">
              Your ultimate destination for reading manga online. Discover new
              series and follow your favorites.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Browse</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link href="/trending" className="hover:text-blue-600">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/recent" className="hover:text-blue-600">
                  Recent Updates
                </Link>
              </li>
              <li>
                <Link href="/genres" className="hover:text-blue-600">
                  All Genres
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Community</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-blue-600">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-blue-600">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-gray-600 text-sm">
          <p>&copy; 2026 Geomanga.ge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
