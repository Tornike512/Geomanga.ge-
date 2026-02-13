"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import {
  useForgotPasswordRequest,
  useForgotPasswordResend,
  useForgotPasswordVerify,
} from "@/features/auth/hooks";
import {
  type ForgotPasswordRequestFormData,
  type ForgotPasswordVerifyFormData,
  forgotPasswordRequestSchema,
  forgotPasswordVerifySchema,
} from "@/features/auth/schemas";
import { ApiError } from "@/lib/api-client";

type Step = "request" | "verify";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const forgotPasswordRequest = useForgotPasswordRequest();
  const forgotPasswordVerify = useForgotPasswordVerify();
  const forgotPasswordResend = useForgotPasswordResend();

  // Form for Step 1: Password Reset Request
  const requestForm = useForm<ForgotPasswordRequestFormData>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: {
      email: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Form for Step 2: OTP Verification
  const verifyForm = useForm<ForgotPasswordVerifyFormData>({
    resolver: zodResolver(forgotPasswordVerifySchema),
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

  // Handle Step 1: Password reset request submission
  const handleRequestSubmit = async (data: ForgotPasswordRequestFormData) => {
    forgotPasswordRequest.mutate(
      {
        email: data.email,
        new_password: data.new_password,
      },
      {
        onSuccess: (response) => {
          setEmail(data.email);
          const expiresAt =
            Date.now() + response.expires_in_minutes * 60 * 1000;
          setOtpExpiresAt(expiresAt);
          setStep("verify");
          setCanResend(false);
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            requestForm.setError("root", {
              message: getRequestErrorMessage(error),
            });
          }
        },
      },
    );
  };

  // Handle Step 2: OTP verification
  const handleVerifySubmit = async (data: ForgotPasswordVerifyFormData) => {
    forgotPasswordVerify.mutate(
      {
        email,
        otp_code: data.otp_code,
      },
      {
        onSuccess: () => {
          router.push("/login?reset=success");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            verifyForm.setError("root", {
              message: getVerifyErrorMessage(error),
            });
          }
        },
      },
    );
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    forgotPasswordResend.mutate(email, {
      onSuccess: (response) => {
        const expiresAt = Date.now() + response.expires_in_minutes * 60 * 1000;
        setOtpExpiresAt(expiresAt);
        setCanResend(false);
        verifyForm.clearErrors();
        verifyForm.reset();
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          verifyForm.setError("root", {
            message:
              "კოდის ხელახალი გაგზავნა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.",
          });
        }
      },
    });
  };

  // Handle edit email (go back to step 1)
  const handleEditEmail = () => {
    setStep("request");
    setEmail("");
    setOtpExpiresAt(0);
    setCanResend(false);
    verifyForm.reset();
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
          {step === "request" ? "პაროლის აღდგენა" : "დაადასტურეთ კოდი"}
        </h1>

        <Card className="p-4 sm:p-8">
          {step === "request" ? (
            <>
              {/* Password Reset Request Form */}
              <p className="mb-6 text-center text-[var(--muted-foreground)] text-sm">
                შეიყვანეთ თქვენი იმეილი და ახალი პაროლი. ჩვენ გამოგიგზავნით
                4-ციფრიან კოდს დასადასტურებლად.
              </p>

              <form
                onSubmit={requestForm.handleSubmit(handleRequestSubmit)}
                className="space-y-6"
              >
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
                    {...requestForm.register("email")}
                    placeholder="შეიყვანეთ თქვენი იმეილი"
                    autoFocus
                  />
                  {requestForm.formState.errors.email && (
                    <p className="mt-1 text-red-400 text-xs">
                      {requestForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="new_password"
                    className="mb-2 block text-[var(--muted-foreground)] text-sm"
                  >
                    ახალი პაროლი
                  </label>
                  <Input
                    id="new_password"
                    type="password"
                    {...requestForm.register("new_password")}
                    placeholder="••••••••"
                  />
                  <p className="mt-2 text-[var(--muted-foreground)] text-xs">
                    უნდა იყოს მინიმუმ 8 სიმბოლო
                  </p>
                  {requestForm.formState.errors.new_password && (
                    <p className="mt-1 text-red-400 text-xs">
                      {requestForm.formState.errors.new_password.message}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label
                    htmlFor="confirm_password"
                    className="mb-2 block text-[var(--muted-foreground)] text-sm"
                  >
                    დაადასტურეთ ახალი პაროლი
                  </label>
                  <Input
                    id="confirm_password"
                    type="password"
                    {...requestForm.register("confirm_password")}
                    placeholder="••••••••"
                  />
                  {requestForm.formState.errors.confirm_password && (
                    <p className="mt-1 text-red-400 text-xs">
                      {requestForm.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {requestForm.formState.errors.root && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <p className="text-red-400 text-sm">
                      {requestForm.formState.errors.root.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full whitespace-nowrap"
                  disabled={forgotPasswordRequest.isPending}
                  loading={forgotPasswordRequest.isPending}
                >
                  {forgotPasswordRequest.isPending
                    ? "გაგზავნა..."
                    : "კოდის გაგზავნა"}
                </Button>

                {/* Back to Login */}
                <div className="text-center text-[var(--muted-foreground)] text-sm">
                  გახსოვთ პაროლი?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-[var(--accent)] transition-colors duration-200 hover:text-[var(--foreground)]"
                  >
                    შესვლა
                  </Link>
                </div>
              </form>
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
                  {email}
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
                onSubmit={verifyForm.handleSubmit(handleVerifySubmit)}
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
                    {...verifyForm.register("otp_code")}
                    placeholder="0000"
                    maxLength={4}
                    className="text-center font-mono text-2xl tracking-widest"
                    autoFocus
                    autoComplete="one-time-code"
                  />
                  {verifyForm.formState.errors.otp_code && (
                    <p className="mt-2 text-center text-red-400 text-xs">
                      {verifyForm.formState.errors.otp_code.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {verifyForm.formState.errors.root && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <p className="text-red-400 text-sm">
                      {verifyForm.formState.errors.root.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full whitespace-nowrap"
                  disabled={forgotPasswordVerify.isPending}
                  loading={forgotPasswordVerify.isPending}
                >
                  {forgotPasswordVerify.isPending
                    ? "დადასტურება..."
                    : "პაროლის აღდგენა"}
                </Button>

                {/* Resend OTP Button */}
                {canResend && (
                  <div className="text-center">
                    <Button
                      variant="unstyled"
                      onClick={handleResendOtp}
                      disabled={forgotPasswordResend.isPending}
                      className="whitespace-nowrap text-[var(--accent)] text-sm transition-colors duration-200 hover:text-[var(--foreground)] disabled:opacity-50"
                    >
                      {forgotPasswordResend.isPending
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

// Helper function to get user-friendly error messages for password reset request
function getRequestErrorMessage(error: ApiError): string {
  const message = error.message.toLowerCase();

  if (message.includes("oauth") || message.includes("google")) {
    return "ეს ანგარიში იყენებს Google-ით შესვლას. გთხოვთ, შეხვიდეთ Google-ით.";
  }

  if (message.includes("not found")) {
    return "ამ იმეილით მომხმარებელი ვერ მოიძებნა.";
  }

  if (message.includes("email") && message.includes("invalid")) {
    return "გთხოვთ, შეიყვანოთ სწორი ელ-ფოსტის მისამართი.";
  }

  if (message.includes("password") && message.includes("short")) {
    return "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.";
  }

  return "პაროლის აღდგენის მოთხოვნა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.";
}

// Helper function to get user-friendly error messages for OTP verification
function getVerifyErrorMessage(error: ApiError): string {
  const message = error.message.toLowerCase();

  if (message.includes("invalid")) {
    return "არასწორი კოდი. გთხოვთ, შეამოწმოთ და სცადოთ თავიდან.";
  }

  if (message.includes("expired")) {
    return "კოდის ვადა გაუვიდა. გთხოვთ, მოითხოვოთ ახალი კოდი.";
  }

  if (message.includes("not") && message.includes("4")) {
    return "გთხოვთ, შეიყვანოთ 4-ციფრიანი კოდი.";
  }

  return "დადასტურება ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.";
}
