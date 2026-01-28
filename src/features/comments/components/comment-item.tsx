"use client";

import {
  Heart,
  MessageCircle,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import type { CommentDetail } from "@/types/comment.types";
import type { User } from "@/types/user.types";
import { UserRole } from "@/types/user.types";
import { formatRelativeTime } from "@/utils/formatters";

interface CommentItemProps {
  readonly comment: CommentDetail;
  readonly currentUser: User | null | undefined;
  readonly onLike: (commentId: number) => void;
  readonly onEdit: (commentId: number, content: string) => void;
  readonly onDelete: (commentId: number) => void;
  readonly onReply?: (commentId: number, content: string) => void;
  readonly isLiking?: boolean;
  readonly isReplying?: boolean;
  readonly isReply?: boolean;
}

export function CommentItem({
  comment,
  currentUser,
  onLike,
  onEdit,
  onDelete,
  onReply,
  isLiking,
  isReplying,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUser?.id === comment.user_id;
  const isAdmin =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.MODERATOR;
  const canModify = isOwner || isAdmin;

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  const handleCancelReply = () => {
    setReplyContent("");
    setShowReplyForm(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex gap-3">
      <Avatar
        src={comment.user.avatar_url}
        alt={comment.user.username}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-[var(--foreground)] text-sm">
                {comment.user.username}
              </span>
              <span className="text-[var(--muted-foreground)] text-xs">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
          </div>
          {canModify && !isEditing && (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] py-1 shadow-lg">
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-[var(--foreground)] text-sm transition-colors hover:bg-white/5"
                    >
                      <Pencil className="h-4 w-4" />
                      რედაქტირება
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(comment.id);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-red-500 text-sm transition-colors hover:bg-white/5"
                  >
                    <Trash2 className="h-4 w-4" />
                    წაშლა
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] text-sm focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              rows={3}
              maxLength={2000}
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                გაუქმება
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editContent.trim()}
              >
                შენახვა
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-wrap break-words text-[var(--foreground)] text-sm">
            {comment.content}
          </p>
        )}

        {!isEditing && (
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={() => onLike(comment.id)}
              disabled={isLiking || !currentUser}
              className="flex items-center gap-1.5 text-[var(--muted-foreground)] text-xs transition-colors hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Heart
                className={`h-4 w-4 ${comment.likes > 0 ? "fill-[var(--accent)] text-[var(--accent)]" : ""}`}
              />
              <span>{comment.likes}</span>
            </button>
            {!isReply && currentUser && onReply && (
              <button
                type="button"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1.5 text-[var(--muted-foreground)] text-xs transition-colors hover:text-[var(--accent)]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>პასუხი</span>
              </button>
            )}
          </div>
        )}

        {showReplyForm && (
          <div className="mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="დაწერე პასუხი..."
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              rows={2}
              maxLength={2000}
              disabled={isReplying}
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelReply}
                disabled={isReplying}
              >
                გაუქმება
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || isReplying}
                loading={isReplying}
              >
                პასუხი
              </Button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 border-[var(--border)] border-l-2 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                onLike={onLike}
                onEdit={onEdit}
                onDelete={onDelete}
                isLiking={isLiking}
                isReply={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
