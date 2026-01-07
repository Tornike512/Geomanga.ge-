"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AvatarUpload } from "@/components/avatar-upload";
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
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [formError, setFormError] = useState("");

  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormError("პაროლები არ ერთმანეთი");
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setFormError("პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო");
      return;
    }

    register.mutate(
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        avatar: avatarFile,
      },
      {
        onSuccess: () => {
          router.push("/login?registered=true");
        },
        onError: (error: Error) => {
          setFormError(error.message || "რეგისტრაცია ვერ მოხერხდა");
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
    <div className="container mx-auto max-w-[1920px] px-6 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-md">
        {/* Minimalist Dark Title */}
        <h1 className="mb-8 text-center font-semibold text-3xl tracking-tight sm:text-4xl">
          შექმენით ანგარიში
        </h1>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <AvatarUpload onFileSelect={setAvatarFile} />

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-[var(--muted-foreground)] text-sm"
              >
                მომხმარებლის სახელი
              </label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange("username")}
                placeholder="შეიყვანეთ მომხმარებლის სახელი"
                required
                minLength={3}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[var(--muted-foreground)] text-sm"
              >
                იმეილი
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="შეიყვანეთ თქვენი იმეილი"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[var(--muted-foreground)] text-sm"
              >
                პაროლი
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="mt-2 text-[var(--muted-foreground)] text-xs">
                უნდა იყოს მინიმუმ 8 სიმბოლო
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-[var(--muted-foreground)] text-sm"
              >
                დაადასტურეთ პაროლი
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            {/* Error Message */}
            {formError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-red-400 text-sm">{formError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={register.isPending}
              loading={register.isPending}
            >
              {register.isPending ? "ანგარიშის შექმნა..." : "რეგისტრაცია"}
            </Button>

            {/* Login Link */}
            <div className="text-center text-[var(--muted-foreground)] text-sm">
              უკვე გაქვთ ანგარიში?{" "}
              <Link
                href="/login"
                className="font-medium text-[var(--accent)] transition-colors duration-200 hover:text-[var(--foreground)]"
              >
                შესვლა
              </Link>
            </div>
          </form>

          {/* Terms */}
          <div className="mt-6 border-[var(--border)] border-t pt-6 text-center text-[var(--muted-foreground)] text-xs">
            ანგარიშის შექმნით, თქვენ თანახმდებით ჩვენს{" "}
            <a
              href="/terms"
              className="text-[var(--accent)] transition-colors duration-200 hover:text-[var(--foreground)]"
            >
              მომსახურების პირობებს
            </a>{" "}
            და{" "}
            <a
              href="/privacy"
              className="text-[var(--accent)] transition-colors duration-200 hover:text-[var(--foreground)]"
            >
              კონფიდენციალურობის პოლიტიკას
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
