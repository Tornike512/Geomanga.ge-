"use client";

import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Skeleton } from "@/components/skeleton";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUpdateProfile } from "@/features/auth/hooks/use-update-profile";
import { useUploadAvatar } from "@/features/upload/hooks/use-upload-avatar";
import { UserRole } from "@/types/user.types";

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 font-bold text-2xl">
          გთხოვთ შეხვიდეთ სისტემაში პროფილის სანახავად
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-[1920px] px-6 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1">
          <Card className="p-8 text-center">
            {/* Avatar */}
            <div className="relative mb-6 inline-block">
              <Avatar
                src={user.avatar_url}
                alt={user.username}
                size="xl"
                className="border border-[var(--border)] transition-all duration-200 hover:border-[var(--border-hover)]"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-[var(--accent)] p-2 text-[var(--accent-foreground)] shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-200 hover:brightness-110"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Upload avatar"
                  role="img"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={uploadAvatar.isPending}
              />
            </div>

            <h1 className="mb-1 font-semibold text-xl">{user.username}</h1>
            <p className="mb-4 text-[var(--muted-foreground)] text-sm">
              {user.email}
            </p>

            {/* Role Badge */}
            <Badge
              variant={
                user.role === UserRole.ADMIN
                  ? "default"
                  : user.role === UserRole.UPLOADER
                    ? "secondary"
                    : "default"
              }
            >
              {user.role}
            </Badge>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-[var(--border)] border-t pt-6">
              <div>
                <div className="font-medium text-[var(--accent)] text-lg">
                  {user.role}
                </div>
                <div className="text-[var(--muted-foreground)] text-sm">
                  როლი
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="mt-6 border-[var(--border)] border-t pt-6 text-[var(--muted-foreground)] text-sm">
              წევრი {new Date(user.created_at).toLocaleDateString()}-დან
            </div>
          </Card>
        </div>

        {/* Right Column - Edit Profile */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-semibold text-lg">პროფილის პარამეტრები</h2>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  პროფილის რედაქტირება
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block font-medium text-sm"
                >
                  მომხმარებლის სახელი
                </label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block font-medium text-sm"
                >
                  იმეილი
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={!isEditing}
                  required
                />
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={updateProfile.isPending}
                    loading={updateProfile.isPending}
                  >
                    ცვლილებების შენახვა
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user.username,
                        email: user.email,
                      });
                    }}
                  >
                    გაუქმება
                  </Button>
                </div>
              )}
            </form>

            {/* Change Password Section */}
            <div className="mt-8 border-[var(--border)] border-t pt-8">
              <h3 className="mb-4 font-medium text-base">უსაფრთხოება</h3>
              <Button variant="outline">პაროლის შეცვლა</Button>
            </div>

            {/* Danger Zone */}
            {user.role === UserRole.ADMIN && (
              <div className="mt-8 border-[var(--border)] border-t pt-8">
                <h3 className="mb-2 font-medium text-base text-red-400">
                  საშიში ზონა
                </h3>
                <p className="mb-4 text-[var(--muted-foreground)] text-sm">
                  შეუქცევადი მოქმედებები, რომლებიც გავლენას ახდენენ თქვენს
                  ანგარიშზე
                </p>
                <Button variant="destructive">ანგარიშის წაშლა</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
