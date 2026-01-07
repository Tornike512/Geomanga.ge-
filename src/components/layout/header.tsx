"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { useCurrentUser, useLogout } from "@/features/auth";
import { SearchBar } from "@/features/manga/components";
import { getAvatarUrl } from "@/utils/image-urls";

export function Header() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-[var(--border)] border-b bg-[var(--background)]/80 backdrop-blur-md">
      <div className="container mx-auto max-w-[1920px] px-6 md:px-8 lg:px-12">
        <div className="flex h-16 items-center gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 transition-opacity duration-200 hover:opacity-80 focus-visible:text-[var(--accent)] focus-visible:outline-none"
          >
            <Image
              src="/images/geomanga-logo.png"
              alt="Geomanga"
              width={120}
              height={40}
              className="h-20 w-auto"
              priority
            />
          </Link>

          <nav className="hidden shrink-0 items-center gap-6 lg:flex">
            <Link
              href="/browse"
              className="text-[var(--muted-foreground)] text-sm transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
            >
              Browse
            </Link>
            <Link
              href="/genres"
              className="text-[var(--muted-foreground)] text-sm transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
            >
              Genres
            </Link>
            {user && (
              <Link
                href="/library"
                className="text-[var(--muted-foreground)] text-sm transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
              >
                Library
              </Link>
            )}
          </nav>

          <div className="hidden min-w-0 flex-1 md:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--muted)]/40" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
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
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="flex items-center gap-3 transition-colors duration-200 hover:text-[var(--accent)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
      >
        <Image
          src={getAvatarUrl(user.avatar_url)}
          alt={user.username}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full border border-[var(--border)] object-cover transition-all duration-200 hover:border-[var(--border-hover)]"
        />
        <span className="hidden font-medium text-sm sm:inline">
          {user.username}
        </span>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={logout.isPending}
      >
        {logout.isPending ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
