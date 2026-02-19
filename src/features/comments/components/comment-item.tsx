"use client";

import {
  Heart,
  MessageCircle,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
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
    <div id={`comment-${comment.id}`} className="flex gap-3">
      <Link href={`/user/${comment.user_id}`}>
        <Avatar
          src={comment.user.avatar_url}
          alt={comment.user.username}
          size="sm"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/user/${comment.user_id}`}
                className="font-medium text-[var(--foreground)] text-sm transition-colors hover:text-[var(--accent)]"
              >
                {comment.user.username}
              </Link>
              {comment.is_author && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 font-medium text-black text-xs">
                  ავტორი
                </span>
              )}
              {comment.user.role === UserRole.ADMIN && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 font-medium text-white text-xs">
                  ადმინი
                </span>
              )}
              {comment.user.role === UserRole.MODERATOR && (
                <span className="rounded-full bg-purple-500 px-2 py-0.5 font-medium text-white text-xs">
                  მოდერატორი
                </span>
              )}
              <span className="text-[var(--muted-foreground)] text-xs">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
          </div>
          {canModify && !isEditing && (
            <div ref={menuRef} className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="h-auto p-1"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              {isMenuOpen && (
                <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-[3px] border border-[var(--border)] bg-[var(--card)] py-1 shadow-lg">
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(true);
                        setIsMenuOpen(false);
                      }}
                      className="h-auto w-full justify-start gap-2 rounded-none px-3 py-2"
                    >
                      <Pencil className="h-4 w-4" />
                      რედაქტირება
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onDelete(comment.id);
                      setIsMenuOpen(false);
                    }}
                    className="h-auto w-full justify-start gap-2 rounded-none px-3 py-2 text-red-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    წაშლა
                  </Button>
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (editContent.trim() && editContent !== comment.content) {
                    handleSaveEdit();
                  }
                }
              }}
              className="w-full resize-none rounded-[3px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] text-base focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(comment.id)}
              disabled={isLiking || !currentUser}
              className="h-auto gap-1.5 p-0 text-[var(--muted-foreground)] text-xs hover:bg-transparent hover:text-[var(--accent)]"
            >
              <Heart
                className={`h-4 w-4 ${comment.likes > 0 ? "fill-[var(--accent)] text-[var(--accent)]" : ""}`}
              />
              <span>{comment.likes}</span>
            </Button>
            {currentUser && onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="h-auto gap-1.5 p-0 text-[var(--muted-foreground)] text-xs hover:bg-transparent hover:text-[var(--accent)]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>პასუხი</span>
              </Button>
            )}
          </div>
        )}

        {showReplyForm && (
          <div className="mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (replyContent.trim() && !isReplying) {
                    handleSubmitReply();
                  }
                }
              }}
              placeholder="დაწერე პასუხი..."
              className="w-full resize-none rounded-[3px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] text-base placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
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
                onReply={onReply}
                isLiking={isLiking}
                isReplying={isReplying}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
