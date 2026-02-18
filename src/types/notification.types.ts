export type NotificationType =
  | "new_chapter"
  | "comment_on_manga"
  | "reply_to_comment";

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  is_read: boolean;
  message: string;
  manga_id?: number | null;
  chapter_id?: number | null;
  comment_id?: number | null;
  created_at: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unread_count: number;
}

export interface UnreadCountResponse {
  count: number;
}
