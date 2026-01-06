"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { useRegister } from "@/features/auth/hooks/use-register";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    register.mutate(
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          router.push("/login?registered=true");
        },
        onError: (error: Error) => {
          setFormError(error.message || "Registration failed");
        },
      },
    );
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setFormError("");
    };

  return (
    <div className="container mx-auto max-w-[95vw] px-8 py-32">
      <div className="mx-auto max-w-2xl">
        {/* Kinetic Typography Title */}
        <h1 className="mb-12 text-center font-bold text-[clamp(2.5rem,8vw,6rem)] uppercase leading-none tracking-tighter">
          SIGN UP
        </h1>

        <Card className="border-2 p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-4 block text-[#A1A1AA] text-sm uppercase tracking-widest"
              >
                USERNAME
              </label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange("username")}
                placeholder="ENTER USERNAME"
                required
                minLength={3}
                className="h-20 border-[#3F3F46] border-t-0 border-r-0 border-b-2 border-l-0 bg-transparent px-0 font-bold text-3xl uppercase tracking-tight focus:border-[#DFE104]"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-4 block text-[#A1A1AA] text-sm uppercase tracking-widest"
              >
                EMAIL
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="ENTER EMAIL"
                required
                className="h-20 border-[#3F3F46] border-t-0 border-r-0 border-b-2 border-l-0 bg-transparent px-0 font-bold text-3xl uppercase tracking-tight focus:border-[#DFE104]"
              />
            </div>

            {/* Password */}
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
                onChange={handleChange("password")}
                placeholder="••••••••"
                required
                minLength={8}
                className="h-20 border-[#3F3F46] border-t-0 border-r-0 border-b-2 border-l-0 bg-transparent px-0 font-bold text-3xl uppercase tracking-tight focus:border-[#DFE104]"
              />
              <p className="mt-3 text-[#71717A] text-sm uppercase tracking-wider">
                MUST BE AT LEAST 8 CHARACTERS
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-4 block text-[#A1A1AA] text-sm uppercase tracking-widest"
              >
                CONFIRM PASSWORD
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="••••••••"
                required
                minLength={8}
                className="h-20 border-[#3F3F46] border-t-0 border-r-0 border-b-2 border-l-0 bg-transparent px-0 font-bold text-3xl uppercase tracking-tight focus:border-[#DFE104]"
              />
            </div>

            {/* Error Message */}
            {formError && (
              <div className="border-red-500 border-l-4 bg-[#27272A] p-6">
                <p className="font-bold text-red-500 text-xl">{formError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={register.isPending}
              loading={register.isPending}
            >
              {register.isPending ? "CREATING ACCOUNT..." : "SIGN UP"}
            </Button>

            {/* Login Link */}
            <div className="text-center text-[#A1A1AA] text-lg">
              ALREADY HAVE AN ACCOUNT?{" "}
              <Link
                href="/login"
                className="font-bold text-[#DFE104] transition-colors hover:text-[#FAFAFA]"
              >
                LOGIN
              </Link>
            </div>
          </form>

          {/* Terms */}
          <div className="mt-8 border-[#3F3F46] border-t-2 pt-8 text-center text-[#71717A] text-sm">
            BY CREATING AN ACCOUNT, YOU AGREE TO OUR{" "}
            <a href="/terms" className="text-[#DFE104] hover:text-[#FAFAFA]">
              TERMS OF SERVICE
            </a>{" "}
            AND{" "}
            <a href="/privacy" className="text-[#DFE104] hover:text-[#FAFAFA]">
              PRIVACY POLICY
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
