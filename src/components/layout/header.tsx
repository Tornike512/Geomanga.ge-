"use client";

import Link from "next/link";
import { Button } from "@/components/button";
import { useCurrentUser } from "@/features/auth";
import { SearchBar } from "@/features/manga/components";
import { getAvatarUrl } from "@/utils/image-urls";

export function Header() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl text-blue-600">
                📖 Geomanga.ge
              </span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/browse"
                className="font-medium text-gray-700 text-sm transition-colors hover:text-blue-600"
              >
                Browse
              </Link>
              <Link
                href="/genres"
                className="font-medium text-gray-700 text-sm transition-colors hover:text-blue-600"
              >
                Genres
              </Link>
              {user && (
                <Link
                  href="/library"
                  className="font-medium text-gray-700 text-sm transition-colors hover:text-blue-600"
                >
                  My Library
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  user,
}: {
  user: { username: string; avatar_url?: string };
}) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <img
          src={getAvatarUrl(user.avatar_url)}
          alt={user.username}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
        />
        <span className="hidden font-medium text-gray-700 text-sm sm:inline">
          {user.username}
        </span>
      </Link>
    </div>
  );
}
