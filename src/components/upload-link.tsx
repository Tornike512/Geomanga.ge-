"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { useCurrentUser } from "@/features/auth";

export function UploadLink() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  const isLoggedIn = !!user;

  const handleClick = () => {
    if (!isLoggedIn) {
      // Not logged in - redirect to login
      router.push("/login?redirect=/upload/manga");
      return;
    }
  };

  // If logged in, show a Link that navigates
  if (isLoggedIn) {
    return (
      <Link href="/upload/manga">
        <Button size="lg" className="whitespace-nowrap">
          მანგის ატვირთვა
        </Button>
      </Link>
    );
  }

  // Not logged in - show button that redirects to login
  return (
    <Button
      size="lg"
      className="whitespace-nowrap"
      onClick={handleClick}
      disabled={isLoading}
    >
      მანგის ატვირთვა
    </Button>
  );
}
