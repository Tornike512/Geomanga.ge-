"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Spinner } from "@/components/spinner";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUpdateProfile } from "@/features/auth/hooks/use-update-profile";
import { useUploadAvatar } from "@/features/upload/hooks/use-upload-avatar";
import { useUploadBanner } from "@/features/upload/hooks/use-upload-banner";
import { type PrivacySettings, UserRole } from "@/types/user.types";

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const uploadBanner = useUploadBanner();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    show_comments: user?.privacy_settings?.show_comments ?? true,
    show_uploaded_manga: user?.privacy_settings?.show_uploaded_manga ?? true,
    show_reading_progress:
      user?.privacy_settings?.show_reading_progress ?? true,
    profile_visibility: user?.privacy_settings?.profile_visibility ?? "public",
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        bio: user.bio || "",
      });
      setPrivacySettings({
        show_comments: user.privacy_settings?.show_comments ?? true,
        show_uploaded_manga: user.privacy_settings?.show_uploaded_manga ?? true,
        show_reading_progress:
          user.privacy_settings?.show_reading_progress ?? true,
        profile_visibility:
          user.privacy_settings?.profile_visibility ?? "public",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      {
        username: formData.username,
        email: formData.email,
        bio: formData.bio || undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handlePrivacyUpdate = () => {
    updateProfile.mutate(
      { privacy_settings: privacySettings },
      {
        onSuccess: () => {
          setIsEditingPrivacy(false);
        },
      },
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file, {
        onSuccess: (_data) => {
          // TODO: Add toast notification
        },
        onError: (_error) => {
          // TODO: Add toast notification
        },
      });
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadBanner.mutate(file, {
        onSuccess: (_data) => {
          // TODO: Add toast notification
        },
        onError: (_error) => {
          // TODO: Add toast notification
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 font-bold text-2xl">
          გთხოვთ შეხვიდეთ სისტემაში პროფილის სანახავად
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-[1920px] px-6 py-12 md:px-8 md:py-12 lg:px-12">
      {/* Banner Section */}
      <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/10">
        {user.banner_url && (
          <Image
            src={user.banner_url}
            alt="Profile banner"
            fill
            className="object-cover"
          />
        )}
        <label
          htmlFor="banner-upload"
          className={`absolute right-4 bottom-4 rounded-full bg-[var(--accent)] p-3 text-[var(--accent-foreground)] shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-200 ${
            uploadBanner.isPending
              ? "cursor-wait opacity-50"
              : "cursor-pointer hover:brightness-110"
          }`}
        >
          {uploadBanner.isPending ? (
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Uploading"
              role="img"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Upload banner"
              role="img"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </label>
        <input
          id="banner-upload"
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
          className="hidden"
          disabled={uploadBanner.isPending}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1">
          <Card className="p-8 text-center">
            {/* Avatar */}
            <div className="-mt-20 relative mb-6 inline-block">
              <Avatar
                src={user.avatar_url}
                alt={user.username}
                size="xl"
                className="border-4 border-[var(--card)] transition-all duration-200 hover:border-[var(--border-hover)]"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute right-0 bottom-0 rounded-full bg-[var(--accent)] p-2 text-[var(--accent-foreground)] shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-200 ${
                  uploadAvatar.isPending
                    ? "cursor-wait opacity-50"
                    : "cursor-pointer hover:brightness-110"
                }`}
              >
                {uploadAvatar.isPending ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-label="Uploading"
                    role="img"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
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
                )}
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

            {/* Bio */}
            {user.bio && (
              <p className="mb-4 text-[var(--foreground)] text-sm">
                {user.bio}
              </p>
            )}

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
          <Card className="mb-6 p-6">
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

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="mb-1 block font-medium text-sm">
                  ბიო
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  disabled={!isEditing}
                  maxLength={500}
                  rows={4}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="მოგვიყევით თქვენს შესახებ..."
                />
                <p className="mt-1 text-[var(--muted-foreground)] text-xs">
                  {formData.bio.length}/500 სიმბოლო
                </p>
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
                        bio: user.bio || "",
                      });
                    }}
                  >
                    გაუქმება
                  </Button>
                </div>
              )}
            </form>
          </Card>

          {/* Privacy Settings */}
          <Card className="mb-6 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-semibold text-lg">კონფიდენციალურობა</h2>
              {!isEditingPrivacy && (
                <Button
                  onClick={() => setIsEditingPrivacy(true)}
                  variant="outline"
                >
                  პარამეტრების რედაქტირება
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {/* Profile Visibility */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">პროფილის ხილვადობა</p>
                  <p className="text-[var(--muted-foreground)] text-xs">
                    თქვენი პროფილის საჯაროობა
                  </p>
                </div>
                <select
                  value={privacySettings.profile_visibility}
                  onChange={(e) =>
                    setPrivacySettings((prev) => ({
                      ...prev,
                      profile_visibility: e.target.value as
                        | "public"
                        | "private",
                    }))
                  }
                  disabled={!isEditingPrivacy}
                  className="rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] text-sm focus:border-[var(--accent)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="public">საჯარო</option>
                  <option value="private">კერძო</option>
                </select>
              </div>

              {/* Show Comments */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">კომენტარების ჩვენება</p>
                  <p className="text-[var(--muted-foreground)] text-xs">
                    თქვენი კომენტარების ხილვადობა
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.show_comments}
                    onChange={(e) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        show_comments: e.target.checked,
                      }))
                    }
                    disabled={!isEditingPrivacy}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-[var(--muted)] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-[var(--border)] after:bg-white after:transition-all after:content-[''] peer-checked:bg-[var(--accent)] peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
                </label>
              </div>

              {/* Show Uploaded Manga */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">
                    ატვირთული მანგის ჩვენება
                  </p>
                  <p className="text-[var(--muted-foreground)] text-xs">
                    თქვენი ატვირთული მანგების ხილვადობა
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.show_uploaded_manga}
                    onChange={(e) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        show_uploaded_manga: e.target.checked,
                      }))
                    }
                    disabled={!isEditingPrivacy}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-[var(--muted)] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-[var(--border)] after:bg-white after:transition-all after:content-[''] peer-checked:bg-[var(--accent)] peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
                </label>
              </div>

              {/* Show Reading Progress */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">
                    კითხვის პროგრესის ჩვენება
                  </p>
                  <p className="text-[var(--muted-foreground)] text-xs">
                    თქვენი კითხვის ისტორიის ხილვადობა
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.show_reading_progress}
                    onChange={(e) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        show_reading_progress: e.target.checked,
                      }))
                    }
                    disabled={!isEditingPrivacy}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-[var(--muted)] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-[var(--border)] after:bg-white after:transition-all after:content-[''] peer-checked:bg-[var(--accent)] peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
                </label>
              </div>

              {/* Action Buttons */}
              {isEditingPrivacy && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handlePrivacyUpdate}
                    disabled={updateProfile.isPending}
                    loading={updateProfile.isPending}
                  >
                    ცვლილებების შენახვა
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingPrivacy(false);
                      setPrivacySettings({
                        show_comments:
                          user.privacy_settings?.show_comments ?? true,
                        show_uploaded_manga:
                          user.privacy_settings?.show_uploaded_manga ?? true,
                        show_reading_progress:
                          user.privacy_settings?.show_reading_progress ?? true,
                        profile_visibility:
                          user.privacy_settings?.profile_visibility ?? "public",
                      });
                    }}
                  >
                    გაუქმება
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            {/* Change Password Section */}
            <div className="border-[var(--border)] border-b pb-8">
              <h3 className="mb-4 font-medium text-base">უსაფრთხოება</h3>
              <Button variant="outline">პაროლის შეცვლა</Button>
            </div>

            {/* Danger Zone */}
            {user.role === UserRole.ADMIN && (
              <div className="pt-8">
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
