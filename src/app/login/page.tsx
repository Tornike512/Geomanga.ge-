"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Input } from "@/components/input";
import { useLogin } from "@/features/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for password reset success
  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      setShowSuccessMessage(true);
      // Clear the query parameter from URL
      router.replace("/login");
      // Hide message after 5 seconds
      const timeout = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync(formData);
    } catch (_error) {}
  };

  return (
    <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-6 py-12 md:px-8 md:py-12 lg:px-12">
      <div className="mx-auto max-w-md">
        {/* Minimalist Dark Title */}
        <h1 className="mb-8 text-center font-semibold text-3xl tracking-tight sm:text-4xl">
          კეთილდგებობით
        </h1>

        <Card>
          <CardContent className="p-8">
            {/* Google Sign-In Button */}
            <GoogleSignInButton className="mb-6 w-full" />

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-[var(--border)] border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--card)] px-2 text-[var(--muted-foreground)]">
                  ან
                </span>
              </div>
            </div>

            {/* Success Message */}
            {showSuccessMessage && (
              <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <p className="text-green-400 text-sm">
                  პაროლი წარმატებით შეიცვალა! შეგიძლიათ შეხვიდეთ ახალი პაროლით.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="login"
                  className="mb-2 block text-[var(--muted-foreground)] text-sm"
                >
                  იმეილი ან მომხმარებლის სახელი
                </label>
                <Input
                  id="login"
                  type="text"
                  value={formData.login}
                  onChange={(e) =>
                    setFormData({ ...formData, login: e.target.value })
                  }
                  placeholder="შეიყვანეთ თქვენი იმეილი"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[var(--muted-foreground)] text-sm"
                  >
                    პაროლი
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[var(--accent)] text-sm transition-colors duration-200 hover:text-[var(--foreground)]"
                  >
                    დაგავიწყდათ პაროლი?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="შეიყვანეთ თქვენი პაროლი"
                  required
                />
              </div>

              {login.isError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-red-400 text-sm">
                    {login.error?.message || "შესვლა ვერ მოხერხდა"}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={login.isPending}
                disabled={login.isPending}
              >
                {login.isPending ? "შესვლა..." : "შესვლა"}
              </Button>
            </form>

            <div className="mt-6 text-center text-[var(--muted-foreground)] text-sm">
              არ გაქვთ ანგარიში?{" "}
              <Link
                href="/register"
                className="font-medium text-[var(--accent)] transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
              >
                დარეგისტრირეთ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
