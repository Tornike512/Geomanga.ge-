"use client";

import { MessageSquare, Star } from "lucide-react";
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
      <div className="container mx-auto max-w-[1920px] px-6 py-12 text-center md:px-8">
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
    <div className="container mx-auto max-w-[1920px] px-6 py-12 md:px-8">
      <Card className="mx-auto max-w-2xl p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <Avatar
            src={profile.avatar_url || undefined}
            alt={profile.username}
            size="xl"
            className="mb-6 border border-[var(--border)]"
          />

          {/* Username */}
          <h1 className="mb-2 font-semibold text-2xl tracking-tight">
            {profile.username}
          </h1>

          {/* Own Profile Indicator */}
          {isOwnProfile && (
            <p className="mb-2 text-[var(--accent)] text-sm">ეს შენ ხარ</p>
          )}

          {/* Role Badge */}
          <Badge variant={getRoleBadgeVariant(profile.role)} className="mb-4">
            {profile.role}
          </Badge>

          {/* Member Since */}
          <p className="text-[var(--muted-foreground)] text-sm">
            წევრი {formatMemberSince(profile.created_at)}-დან
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-[var(--border)] border-t pt-8">
          {/* Comments Stat */}
          <Card className="p-6 text-center">
            <div className="mb-2 flex items-center justify-center gap-2 text-[var(--accent)]">
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold text-2xl">
                {profile.comment_count}
              </span>
            </div>
            <div className="text-[var(--muted-foreground)] text-sm">
              კომენტარი
            </div>
          </Card>

          {/* Ratings Stat */}
          <Card className="p-6 text-center">
            <div className="mb-2 flex items-center justify-center gap-2 text-[var(--accent)]">
              <Star className="h-5 w-5" />
              <span className="font-semibold text-2xl">
                {profile.rating_count}
              </span>
            </div>
            <div className="text-[var(--muted-foreground)] text-sm">
              შეფასება
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
