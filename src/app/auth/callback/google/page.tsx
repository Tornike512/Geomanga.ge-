"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/button";
import { useGoogleAuth } from "@/features/auth";

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { backendAuthMutation } = useGoogleAuth();
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    if (status === "loading") return;
    if (hasAttemptedAuth.current) return;

    if (status === "authenticated" && session?.googleIdToken) {
      hasAttemptedAuth.current = true;
      // Send Google token to backend
      backendAuthMutation.mutate({
        id_token: session.googleIdToken,
        access_token: session.googleAccessToken,
      });
    } else if (status === "unauthenticated") {
      router.push("/login?error=google_auth_failed");
    }
  }, [session, status, backendAuthMutation, router]);

  if (backendAuthMutation.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-400">
            Google-ით ავთენტიფიკაცია ვერ მოხერხდა
          </p>
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="text-[var(--accent)] hover:underline"
          >
            სცადეთ თავიდან
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
        <p className="text-[var(--muted-foreground)]">
          Google-ით ავთენტიფიკაცია...
        </p>
      </div>
    </div>
  );
}
