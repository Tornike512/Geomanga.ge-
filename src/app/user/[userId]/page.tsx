"use client";

import { BookOpen, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { Spinner } from "@/components/spinner";
import { useCurrentUser } from "@/features/auth";
import { usePublicProfile } from "@/features/users";
import { UserRole } from "@/types/user.types";

const getRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "danger";
    case UserRole.MODERATOR:
      return "warning";
    case UserRole.UPLOADER:
      return "secondary";
    default:
      return "default";
  }
};

const formatMemberSince = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("ka-GE", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

export default function PublicProfilePage() {
  const params = useParams();
  const userId = Number(params.userId);

  const { data: profile, isLoading, error } = usePublicProfile(userId);
  const { data: currentUser } = useCurrentUser();

  const isOwnProfile = currentUser?.id === userId;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-4 py-12 text-center sm:px-6 md:px-8">
        <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
          მომხმარებელი ვერ მოიძებნა
        </h1>
        <p className="mt-4 text-[var(--muted-foreground)] text-lg">
          მომხმარებელი, რომელსაც ეძებთ, არ არსებობს.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-[1920px] overflow-x-hidden px-4 py-12 sm:px-6 md:px-8">
      {/* Banner Section */}
      <div className="relative mb-8 aspect-[3/1] w-full overflow-hidden rounded-lg bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/10">
        {profile.banner_url && (
          <Image
            src={profile.banner_url}
            alt={`${profile.username}'s banner`}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1">
          <Card className="p-8 text-center">
            {/* Avatar */}
            <div className="-mt-20 relative mb-6 inline-block">
              <Avatar
                src={profile.avatar_url || undefined}
                alt={profile.username}
                size="xl"
                className="border-4 border-[var(--card)]"
              />
            </div>

            {/* Username */}
            <h1 className="mb-2 truncate font-semibold text-2xl tracking-tight">
              {profile.username}
            </h1>

            {/* Own Profile Indicator */}
            {isOwnProfile && (
              <p className="mb-2 text-[var(--accent)] text-sm">ეს შენ ხარ</p>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="mb-4 text-[var(--foreground)] text-sm">
                {profile.bio}
              </p>
            )}

            {/* Role Badge */}
            <Badge variant={getRoleBadgeVariant(profile.role)} className="mb-4">
              {profile.role}
            </Badge>

            {/* Member Since */}
            <p className="text-[var(--muted-foreground)] text-sm">
              წევრი {formatMemberSince(profile.created_at)}-დან
            </p>

            {/* Stats Section */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-[var(--border)] border-t pt-6">
              {/* Ratings Stat */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">შეფასებები</span>
                </div>
                <span className="font-semibold text-[var(--accent)]">
                  {profile.rating_count}
                </span>
              </div>

              {/* Manga Count Stat */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">ატვირთული მანგა</span>
                </div>
                <span className="font-semibold text-[var(--accent)]">
                  {profile.manga_count}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Activity */}
        <div className="lg:col-span-2">
          {/* Uploaded Manga Section */}
          {profile.uploaded_manga.length > 0 && (
            <Card className="mb-6 p-6">
              <h2 className="mb-4 font-semibold text-lg">ატვირთული მანგა</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {profile.uploaded_manga.map((manga) => (
                  <Link
                    key={manga.id}
                    href={`/manga/${manga.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-[var(--border)] transition-all group-hover:border-[var(--accent)]">
                      {manga.cover_image ? (
                        <Image
                          src={manga.cover_image}
                          alt={manga.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[var(--muted)]">
                          <BookOpen className="h-12 w-12 text-[var(--muted-foreground)]" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute inset-x-0 top-0 flex justify-center p-1.5">
                        <Badge
                          variant={
                            manga.status === "completed"
                              ? "default"
                              : manga.status === "ongoing"
                                ? "secondary"
                                : "warning"
                          }
                          className="max-w-full truncate bg-black/60 px-2 py-0.5 text-[10px] backdrop-blur-md"
                        >
                          {manga.status === "completed"
                            ? "დასრულებული"
                            : manga.status === "ongoing"
                              ? "მიმდინარე"
                              : manga.status === "hiatus"
                                ? "შეჩერებული"
                                : "გაუქმებული"}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm">{manga.title}</p>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Empty State */}
          {profile.uploaded_manga.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-[var(--muted-foreground)]">
                მომხმარებელს ჯერ არ აქვს აქტივობა
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
