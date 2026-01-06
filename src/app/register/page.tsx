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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-3xl">Create Account</h1>
          <p className="text-gray-600">Join Geomanga.ge today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-1 block font-medium text-sm"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange("username")}
              placeholder="Choose a username"
              required
              minLength={3}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block font-medium text-sm">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block font-medium text-sm"
            >
              Password
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
            <p className="mt-1 text-gray-500 text-xs">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block font-medium text-sm"
            >
              Confirm Password
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
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {formError}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={register.isPending}
            loading={register.isPending}
          >
            {register.isPending ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Login Link */}
          <div className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>

        {/* Terms */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
        </div>
      </Card>
    </div>
  );
}
