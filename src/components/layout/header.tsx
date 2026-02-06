"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import { useCurrentUser, useLogout } from "@/features/auth";
import { SearchBar } from "@/features/manga/components";

export function Header() {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide header on reader pages
  if (pathname?.startsWith("/read")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-[60] w-full overflow-x-hidden border-[var(--border)] border-b bg-[var(--background)]/80 backdrop-blur-md">
        <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-2 sm:px-4 md:px-8">
          <div className="flex h-16 w-full items-center gap-2 overflow-x-hidden sm:gap-6">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3 transition-opacity duration-200 hover:opacity-80 focus-visible:text-[var(--accent)] focus-visible:outline-none"
            >
              <Image
                src="/images/geomanga-logo.png"
                alt="Geomanga"
                width={120}
                height={40}
                className="h-8 w-auto sm:h-10"
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

            <div className="min-w-0 flex-1">
              <SearchBar />
            </div>

            <div className="ml-auto hidden shrink-0 items-center gap-4 sm:flex">
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

            {/* Hamburger menu - visible only on < sm screens */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="ml-auto h-auto shrink-0 p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] sm:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      <div
        className={`fixed top-16 right-0 left-0 z-[59] origin-top transform border-[var(--border)] border-b bg-[var(--background)] shadow-lg transition-all duration-300 ease-in-out sm:hidden ${
          isMobileMenuOpen
            ? "scale-y-100 opacity-100"
            : "pointer-events-none scale-y-0 opacity-0"
        }`}
      >
        {/* User section */}
        {!isLoading && user && (
          <div className="border-[var(--border)] border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar src={user.avatar_url} alt={user.username} size="md" />
              <span className="font-medium">{user.username}</span>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="px-4 py-2">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]/10"
            >
              მთავარი
            </Link>
            <Link
              href="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]/10"
            >
              ნავიგაცია
            </Link>
            {user && (
              <>
                <Link
                  href="/library"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]/10"
                >
                  ბიბლიოთეკა
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]/10"
                >
                  პროფილი
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Auth section */}
        <div className="border-[var(--border)] border-t px-4 py-3">
          {isLoading ? (
            <div className="h-10 animate-pulse rounded-lg bg-[var(--muted)]/40" />
          ) : user ? (
            <MobileLogoutButton onLogout={() => setIsMobileMenuOpen(false)} />
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  შესვლა
                </Button>
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1"
              >
                <Button className="w-full">რეგისტრაცია</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[58] bg-black/30 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
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

function MobileLogoutButton({ onLogout }: { onLogout: () => void }) {
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
    onLogout();
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleLogout}
      disabled={logout.isPending}
    >
      {logout.isPending ? "გამოსვლა..." : "გასვლა"}
    </Button>
  );
}
