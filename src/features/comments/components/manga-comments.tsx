"use client";

import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Spinner } from "@/components/spinner";
import { useCurrentUser } from "@/features/auth";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import {
  useCreateMangaComment,
  useDeleteComment,
  useMangaComments,
  useReplyToComment,
  useToggleLikeComment,
  useUpdateComment,
} from "../hooks";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface MangaCommentsProps {
  readonly mangaId: number;
}

export function MangaComments({ mangaId }: MangaCommentsProps) {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: currentUser } = useCurrentUser();
  const { data: commentsData, isLoading } = useMangaComments(mangaId, {
    page,
    page_size: pageSize,
  });

  const createComment = useCreateMangaComment(mangaId);
  const deleteComment = useDeleteComment();
  const updateComment = useUpdateComment();
  const toggleLike = useToggleLikeComment();
  const replyToComment = useReplyToComment();
  const { confirm, ConfirmModalComponent } = useConfirmModal();

  const handleSubmitComment = (content: string) => {
    createComment.mutate(content, {
      onSuccess: () => {
        setPage(1);
      },
    });
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = await confirm("ნამდვილად გსურთ კომენტარის წაშლა?");
    if (confirmed) {
      deleteComment.mutate(commentId);
    }
  };

  const handleEditComment = (commentId: number, content: string) => {
    updateComment.mutate({ commentId, content });
  };

  const handleLikeComment = (commentId: number) => {
    toggleLike.mutate(commentId);
  };

  const handleReplyComment = (commentId: number, content: string) => {
    replyToComment.mutate({ commentId, content });
  };

  const totalPages = commentsData?.pages ?? 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="py-8">
      {ConfirmModalComponent}
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-[var(--accent)]" />
        <h2 className="font-semibold text-[var(--foreground)] text-lg">
          კომენტარები
        </h2>
        {commentsData && (
          <span className="text-[var(--muted-foreground)] text-sm">
            ({commentsData.total})
          </span>
        )}
      </div>

      <div className="mb-6">
        <CommentForm
          currentUser={currentUser}
          onSubmit={handleSubmitComment}
          isSubmitting={createComment.isPending}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : commentsData && commentsData.items.length > 0 ? (
        <>
          <div className="space-y-6">
            {commentsData.items.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onLike={handleLikeComment}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onReply={handleReplyComment}
                isLiking={toggleLike.isPending}
                isReplying={replyToComment.isPending}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-[var(--muted-foreground)] text-sm">
                {page} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] py-12">
          <MessageCircle className="h-12 w-12 text-[var(--muted-foreground)]" />
          <p className="mt-3 text-center text-[var(--muted-foreground)]">
            კომენტარები ჯერ არ არის
          </p>
          <p className="mt-1 text-center text-[var(--muted-foreground)] text-sm">
            იყავი პირველი, ვინც დაწერს კომენტარს!
          </p>
        </div>
      )}
    </div>
  );
}
