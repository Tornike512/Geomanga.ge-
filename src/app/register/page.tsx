"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Input } from "@/components/input";
import {
  useRegisterRequest,
  useRegisterVerify,
  useResendOtp,
} from "@/features/auth/hooks";
import {
  type OtpVerifyFormData,
  otpVerifySchema,
  type RegisterRequestFormData,
  registerRequestSchema,
} from "@/features/auth/schemas";
import { ApiError } from "@/lib/api-client";

type Step = "register" | "verify";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const registerRequest = useRegisterRequest();
  const registerVerify = useRegisterVerify();
  const resendOtp = useResendOtp();

  // Form for Step 1: Registration
  const registerForm = useForm<RegisterRequestFormData>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      username: "",
      email: "",
      gender: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  // Form for Step 2: OTP Verification
  const otpForm = useForm<OtpVerifyFormData>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      otp_code: "",
    },
  });

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (step !== "verify" || otpExpiresAt === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((otpExpiresAt - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, otpExpiresAt]);

  // Show resend button after 30 seconds
  useEffect(() => {
    if (step !== "verify") return;

    const timeout = setTimeout(() => {
      setCanResend(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timeout);
  }, [step]);

  // Handle Step 1: Registration form submission
  const handleRegisterSubmit = async (data: RegisterRequestFormData) => {
    registerRequest.mutate(
      {
        email: data.email,
        username: data.username,
        password: data.password,
        gender: data.gender,
      },
      {
        onSuccess: (response) => {
          setRegisteredEmail(data.email);
          // Set expiration time (10 minutes from now)
          const expiresAt =
            Date.now() + response.expires_in_minutes * 60 * 1000;
          setOtpExpiresAt(expiresAt);
          setStep("verify");
          setCanResend(false);
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            registerForm.setError("root", {
              message: getErrorMessage(error),
            });
          }
        },
      },
    );
  };

  // Handle Step 2: OTP verification
  const handleOtpSubmit = async (data: OtpVerifyFormData) => {
    registerVerify.mutate(
      {
        email: registeredEmail,
        otp_code: data.otp_code,
      },
      {
        onSuccess: () => {
          // User is automatically logged in (cookies set by backend)
          router.push("/");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            otpForm.setError("root", {
              message: getOtpErrorMessage(error),
            });
          }
        },
      },
    );
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    resendOtp.mutate(registeredEmail, {
      onSuccess: (response) => {
        // Reset expiration time
        const expiresAt = Date.now() + response.expires_in_minutes * 60 * 1000;
        setOtpExpiresAt(expiresAt);
        setCanResend(false);
        otpForm.clearErrors();
        otpForm.reset();
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          otpForm.setError("root", {
            message:
              "კოდის ხელახალი გაგზავნა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.",
          });
        }
      },
    });
  };

  // Handle edit email (go back to step 1)
  const handleEditEmail = () => {
    setStep("register");
    setRegisteredEmail("");
    setOtpExpiresAt(0);
    setCanResend(false);
    otpForm.reset();
  };

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto flex max-w-[1920px] flex-1 items-center justify-center overflow-x-hidden px-2 py-4 sm:px-4 md:px-8">
      <div className="mx-auto w-full max-w-md">
        {/* Title */}
        <h1 className="mb-8 text-center font-semibold text-3xl tracking-tight sm:text-4xl">
          {step === "register" ? "შექმენით ანგარიში" : "დაადასტურეთ იმეილი"}
        </h1>

        <Card className="p-4 sm:p-8">
          {step === "register" ? (
            <>
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

              {/* Registration Form */}
              <form
                onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                className="space-y-6"
              >
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
                    {...registerForm.register("username")}
                    placeholder="შეიყვანეთ მომხმარებლის სახელი"
                  />
                  {registerForm.formState.errors.username && (
                    <p className="mt-1 text-red-400 text-xs">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
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
                    {...registerForm.register("email")}
                    placeholder="შეიყვანეთ თქვენი იმეილი"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="mt-1 text-red-400 text-xs">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <fieldset>
                  <legend className="mb-3 block text-[var(--muted-foreground)] text-sm">
                    სქესი <span className="text-red-400">*</span>
                  </legend>
                  <div className="flex gap-6">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value="male"
                        {...registerForm.register("gender")}
                        className="h-4 w-4 cursor-pointer border-[var(--border)] accent-[var(--accent)]"
                      />
                      <span className="text-sm">მამრობითი</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value="female"
                        {...registerForm.register("gender")}
                        className="h-4 w-4 cursor-pointer border-[var(--border)] accent-[var(--accent)]"
                      />
                      <span className="text-sm">მდედრობითი</span>
                    </label>
                  </div>
                  {registerForm.formState.errors.gender && (
                    <p className="mt-2 text-red-400 text-xs">
                      {registerForm.formState.errors.gender.message}
                    </p>
                  )}
                </fieldset>

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
                    {...registerForm.register("password")}
                    placeholder="••••••••"
                  />
                  <p className="mt-2 text-[var(--muted-foreground)] text-xs">
                    უნდა იყოს მინიმუმ 8 სიმბოლო
                  </p>
                  {registerForm.formState.errors.password && (
                    <p className="mt-1 text-red-400 text-xs">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
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
                    {...registerForm.register("confirmPassword")}
                    placeholder="••••••••"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-red-400 text-xs">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {registerForm.formState.errors.root && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <p className="text-red-400 text-sm">
                      {registerForm.formState.errors.root.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerRequest.isPending}
                  loading={registerRequest.isPending}
                >
                  {registerRequest.isPending ? "გაგზავნა..." : "გაგრძელება"}
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
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <div className="mb-6 text-center">
                <p className="mb-2 text-[var(--muted-foreground)]">
                  შეიყვანეთ 4-ციფრიანი კოდი, რომელიც გამოიგზავნა შემდეგ
                  მისამართზე:
                </p>
                <p className="mb-4 font-medium text-[var(--foreground)]">
                  {registeredEmail}
                </p>
                <Button
                  variant="unstyled"
                  onClick={handleEditEmail}
                  className="text-[var(--accent)] text-sm transition-colors duration-200 hover:text-[var(--foreground)]"
                >
                  იმეილის შეცვლა
                </Button>
              </div>

              {/* Timer */}
              {timeRemaining > 0 && (
                <div className="mb-6 text-center">
                  <p className="text-[var(--muted-foreground)] text-sm">
                    კოდი იმოქმედებს კიდევ:{" "}
                    <span className="font-mono font-semibold text-[var(--foreground)]">
                      {formatTime(timeRemaining)}
                    </span>
                  </p>
                </div>
              )}

              {/* OTP Form */}
              <form
                onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="otp_code"
                    className="mb-2 block text-center text-[var(--muted-foreground)] text-sm"
                  >
                    დადასტურების კოდი
                  </label>
                  <Input
                    id="otp_code"
                    type="text"
                    {...otpForm.register("otp_code")}
                    placeholder="0000"
                    maxLength={4}
                    className="text-center font-mono text-2xl tracking-widest"
                    autoFocus
                    autoComplete="one-time-code"
                  />
                  {otpForm.formState.errors.otp_code && (
                    <p className="mt-2 text-center text-red-400 text-xs">
                      {otpForm.formState.errors.otp_code.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {otpForm.formState.errors.root && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <p className="text-red-400 text-sm">
                      {otpForm.formState.errors.root.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerVerify.isPending}
                  loading={registerVerify.isPending}
                >
                  {registerVerify.isPending ? "დადასტურება..." : "დადასტურება"}
                </Button>

                {/* Resend OTP Button */}
                {canResend && (
                  <div className="text-center">
                    <Button
                      variant="unstyled"
                      onClick={handleResendOtp}
                      disabled={resendOtp.isPending}
                      className="text-[var(--accent)] text-sm transition-colors duration-200 hover:text-[var(--foreground)] disabled:opacity-50"
                    >
                      {resendOtp.isPending
                        ? "გაგზავნა..."
                        : "კოდის ხელახალი გაგზავნა"}
                    </Button>
                  </div>
                )}
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// Helper function to get user-friendly error messages
function getErrorMessage(error: ApiError): string {
  const message = error.message.toLowerCase();

  if (message.includes("email") && message.includes("already")) {
    return "ეს იმეილი უკვე რეგისტრირებულია. გთხოვთ, გამოიყენოთ სხვა იმეილი ან შეხვიდეთ სისტემაში.";
  }

  if (message.includes("username") && message.includes("already")) {
    return "ეს მომხმარებლის სახელი უკვე დაკავებულია. გთხოვთ, აირჩიოთ სხვა.";
  }

  if (message.includes("email") && message.includes("send")) {
    return "იმეილის გაგზავნა ვერ მოხერხდა. გთხოვთ, შეამოწმოთ თქვენი იმეილი და სცადოთ თავიდან.";
  }

  return "რეგისტრაცია ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.";
}

function getOtpErrorMessage(error: ApiError): string {
  const message = error.message.toLowerCase();

  if (message.includes("invalid") || message.includes("incorrect")) {
    return "არასწორი დადასტურების კოდი. გთხოვთ, სცადოთ თავიდან.";
  }

  if (message.includes("expired")) {
    return "დადასტურების კოდის ვადა გაუვიდა. დააჭირეთ 'კოდის ხელახალი გაგზავნა'-ს ახალი კოდის მისაღებად.";
  }

  return "დადასტურება ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.";
}
