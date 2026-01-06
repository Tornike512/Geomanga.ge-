"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Input } from "@/components/input";
import { useLogin } from "@/features/auth";

export default function LoginPage() {
  const login = useLogin();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync(formData);
    } catch (_error) {}
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-md">
        {/* Minimalist Dark Title */}
        <h1 className="mb-8 text-center font-semibold text-3xl tracking-tight sm:text-4xl">
          Welcome back
        </h1>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="login"
                  className="mb-2 block text-[var(--muted-foreground)] text-sm"
                >
                  Email or username
                </label>
                <Input
                  id="login"
                  type="text"
                  value={formData.login}
                  onChange={(e) =>
                    setFormData({ ...formData, login: e.target.value })
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[var(--muted-foreground)] text-sm"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              {login.isError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-red-400 text-sm">
                    {login.error?.message || "Login failed"}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={login.isPending}
                disabled={login.isPending}
              >
                {login.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center text-[var(--muted-foreground)] text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-[var(--accent)] transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
