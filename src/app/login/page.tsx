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
    <div className="container mx-auto max-w-[95vw] px-8 py-32">
      <div className="mx-auto max-w-2xl">
        {/* Kinetic Typography Title */}
        <h1 className="mb-12 text-center font-bold text-[clamp(2.5rem,8vw,6rem)] uppercase leading-none tracking-tighter">
          LOGIN
        </h1>

        <Card className="border-2">
          <CardContent className="p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="login"
                  className="mb-4 block text-[#A1A1AA] text-sm uppercase tracking-widest"
                >
                  EMAIL OR USERNAME
                </label>
                <Input
                  id="login"
                  type="text"
                  value={formData.login}
                  onChange={(e) =>
                    setFormData({ ...formData, login: e.target.value })
                  }
                  className="h-20 border-[#3F3F46] border-t-0 border-r-0 border-b-2 border-l-0 bg-transparent px-0 font-bold text-3xl uppercase tracking-tight focus:border-[#DFE104]"
                  placeholder="ENTER EMAIL"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-4 block text-[#A1A1AA] text-sm uppercase tracking-widest"
                >
                  PASSWORD
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-20 border-[#3F3F46] border-t-0 border-r-0 border-b-2 border-l-0 bg-transparent px-0 font-bold text-3xl uppercase tracking-tight focus:border-[#DFE104]"
                  placeholder="ENTER PASSWORD"
                  required
                />
              </div>

              {login.isError && (
                <div className="border-red-500 border-l-4 bg-[#27272A] p-6">
                  <p className="font-bold text-red-500 text-xl">
                    {login.error?.message || "LOGIN FAILED"}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={login.isPending}
                disabled={login.isPending}
              >
                {login.isPending ? "LOGGING IN..." : "LOGIN"}
              </Button>
            </form>

            <div className="mt-8 text-center text-[#A1A1AA] text-lg">
              DON'T HAVE AN ACCOUNT?{" "}
              <Link
                href="/register"
                className="font-bold text-[#DFE104] transition-colors hover:text-[#FAFAFA]"
              >
                SIGN UP
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
