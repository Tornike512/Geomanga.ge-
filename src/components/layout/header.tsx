"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { useCurrentUser } from "@/features/auth";
import { SearchBar } from "@/features/manga/components";
import { getAvatarUrl } from "@/utils/image-urls";

export function Header() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-[#3F3F46] border-b-2 bg-[#09090B]/95 backdrop-blur">
      <div className="container mx-auto max-w-[95vw] px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3">
              <span className="font-bold text-3xl uppercase tracking-tighter">
                📖 GEOMANGA
              </span>
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                href="/browse"
                className="font-bold text-sm uppercase tracking-wider transition-colors hover:text-[#DFE104]"
              >
                BROWSE
              </Link>
              <Link
                href="/genres"
                className="font-bold text-sm uppercase tracking-wider transition-colors hover:text-[#DFE104]"
              >
                GENRES
              </Link>
              {user && (
                <Link
                  href="/library"
                  className="font-bold text-sm uppercase tracking-wider transition-colors hover:text-[#DFE104]"
                >
                  LIBRARY
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-none bg-[#27272A]" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost">LOGIN</Button>
                </Link>
                <Link href="/register">
                  <Button>SIGN UP</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="border-[#3F3F46] border-t-2 pt-4 pb-4">
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
        className="flex items-center gap-3 transition-colors hover:text-[#DFE104]"
      >
        <Image
          src={getAvatarUrl(user.avatar_url)}
          alt={user.username}
          width={40}
          height={40}
          className="h-10 w-10 rounded-none border-2 border-[#3F3F46] object-cover"
        />
        <span className="hidden font-bold text-sm uppercase tracking-wider sm:inline">
          {user.username}
        </span>
      </Link>
    </div>
  );
}
