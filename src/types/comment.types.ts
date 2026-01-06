import type { User } from "./user.types";

export interface Comment {
  readonly id: number;
  readonly user_id: number;
  readonly manga_id: number;
  readonly chapter_id: number | undefined;
  readonly content: string;
  readonly likes: number;
  readonly created_at: string;
}

export interface CommentDetail extends Comment {
  readonly user: User;
}

export interface CommentListResponse {
  readonly items: CommentDetail[];
  readonly total: number;
}

export interface CommentCreate {
  readonly content: string;
  readonly manga_id?: number;
  readonly chapter_id?: number;
}

export interface CommentUpdate {
  readonly content: string;
}
