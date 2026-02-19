"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import type { User } from "@/types/user.types";

interface CommentFormProps {
  readonly currentUser: User | null | undefined;
  readonly isUserLoading?: boolean;
  readonly onSubmit: (content: string) => void;
  readonly isSubmitting?: boolean;
}

export function CommentForm({
  currentUser,
  isUserLoading,
  onSubmit,
  isSubmitting,
}: CommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  if (isUserLoading) {
    return null;
  }

  if (!currentUser) {
    return (
      <div className="rounded-[3px] border border-[var(--border)] bg-[var(--card)] p-4 text-center">
        <p className="text-[var(--muted-foreground)] text-sm">
          კომენტარის დასატოვებლად{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            შედით სისტემაში
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (content.trim() && !isSubmitting) {
              onSubmit(content.trim());
              setContent("");
            }
          }
        }}
        placeholder="დაწერე კომენტარი..."
        className="w-full resize-none rounded-[3px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] text-base placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        rows={3}
        maxLength={2000}
        disabled={isSubmitting}
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            src={currentUser.avatar_url}
            alt={currentUser.username}
            size="sm"
          />
          <span className="text-[var(--muted-foreground)] text-xs">
            {content.length}/2000
          </span>
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isSubmitting}
          loading={isSubmitting}
        >
          <Send className="mr-1.5 h-3.5 w-3.5" />
          გაგზავნა
        </Button>
      </div>
    </form>
  );
}
