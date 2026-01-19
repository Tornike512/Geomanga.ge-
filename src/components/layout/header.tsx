"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import { useCurrentUser, useLogout } from "@/features/auth";
import { SearchBar } from "@/features/manga/components";

export function Header() {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();

  // Hide header on reader pages
  if (pathname?.startsWith("/read")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-[var(--border)] border-b bg-[var(--background)]/80 backdrop-blur-md">
      <div className="container mx-auto max-w-[1920px] px-6 md:px-8">
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
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden shrink-0 items-center gap-6 lg:flex">
            <Link
              href="/browse"
              className="text-[var(--muted-foreground)] text-sm transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
            >
              ნავიგაცია
            </Link>
            {user && (
              <Link
                href="/library"
                className="text-[var(--muted-foreground)] text-sm transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
              >
                ბიბლიოთეკა
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
                    შესვლა
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">რეგისტრაცია</Button>
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
        <Avatar src={user.avatar_url} alt={user.username} size="md" />
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
        {logout.isPending ? "გამოსვლა..." : "გასვლა"}
      </Button>
    </div>
  );
}
