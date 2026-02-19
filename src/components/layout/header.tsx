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
import { NotificationBell } from "@/features/notifications";

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
      <header className="sticky top-0 z-[60] w-full overflow-x-hidden border-[#2E2E2E] border-b bg-[#141414]">
        <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-2 sm:px-4 md:px-8">
          <div className="flex h-16 w-full items-center gap-2 overflow-x-hidden sm:gap-6">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3 opacity-90 transition-opacity duration-150 hover:opacity-100 focus-visible:outline-none"
            >
              <Image
                src="/images/geomanga-logo.png"
                alt="Geomanga"
                width={120}
                height={40}
                className="h-10 w-auto sm:h-12"
                priority
              />
            </Link>

            <nav className="hidden shrink-0 items-center gap-6 lg:flex">
              <Link
                href="/browse"
                className="text-[#888888] text-sm transition-colors duration-100 hover:text-[#F0F0F0] focus-visible:text-[var(--accent)] focus-visible:outline-none"
              >
                ნავიგაცია
              </Link>
            </nav>

            <div className="min-w-0 flex-1">
              <SearchBar />
            </div>

            <div className="ml-auto hidden shrink-0 items-center gap-4 lg:flex">
              {isLoading ? (
                <div className="h-9 w-9 animate-pulse rounded-[3px] bg-[var(--elevated)]" />
              ) : user ? (
                <>
                  <NotificationBell isLoggedIn={true} />
                  <UserMenu user={user} />
                </>
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

            {/* Bell icon - mobile only, visible when logged in */}
            {!isLoading && user && (
              <div className="shrink-0 lg:hidden">
                <NotificationBell isLoggedIn={true} />
              </div>
            )}

            {/* Hamburger menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="h-auto shrink-0 p-1 text-[#888888] hover:text-[#F0F0F0] lg:hidden"
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
        className={`fixed top-16 right-0 left-0 z-[59] origin-top transform border-[#2E2E2E] border-b bg-[#141414] transition-all duration-200 ease-out lg:hidden ${
          isMobileMenuOpen
            ? "scale-y-100 opacity-100"
            : "pointer-events-none scale-y-0 opacity-0"
        }`}
      >
        {/* User section */}
        {!isLoading && user && (
          <Link
            href="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block border-[#2E2E2E] border-b px-4 py-3 transition-colors hover:bg-[var(--elevated)]"
          >
            <div className="flex items-center gap-3">
              <Avatar src={user.avatar_url} alt={user.username} size="md" />
              <span className="font-medium">{user.username}</span>
            </div>
          </Link>
        )}

        {/* Navigation links */}
        <nav className="px-4 py-2">
          <div className="space-y-0.5">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-[3px] px-4 py-3 text-[var(--foreground)] transition-colors hover:bg-[var(--elevated)]"
            >
              მთავარი
            </Link>
            <Link
              href="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-[3px] px-4 py-3 text-[var(--foreground)] transition-colors hover:bg-[var(--elevated)]"
            >
              ნავიგაცია
            </Link>
            {user && (
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-[3px] px-4 py-3 text-[var(--foreground)] transition-colors hover:bg-[var(--elevated)]"
              >
                პროფილი
              </Link>
            )}
          </div>
        </nav>

        {/* Auth section */}
        <div className="border-[#2E2E2E] border-t px-4 py-3">
          {isLoading ? (
            <div className="h-10 animate-pulse rounded-[3px] bg-[var(--elevated)]" />
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
          className="fixed inset-0 z-[58] bg-black/40 lg:hidden"
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
        className="flex items-center gap-3 transition-colors duration-100 hover:text-[var(--accent)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
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
