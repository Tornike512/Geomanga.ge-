export enum UserRole {
  USER = "USER",
  UPLOADER = "UPLOADER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export type AuthProvider = "local" | "google";

export interface User {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly gender: "male" | "female";
  readonly avatar_url: string | undefined;
  readonly bio: string | null;
  readonly banner_url: string | null;
  readonly privacy_settings: PrivacySettings | null;
  readonly role: UserRole;
  readonly is_active: boolean;
  readonly created_at: string;
  readonly auth_provider: AuthProvider;
}

export interface UserCreate {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly gender: "male" | "female";
}

export interface UserUpdate {
  readonly username?: string;
  readonly avatar_url?: string;
  readonly bio?: string;
  readonly banner_url?: string;
  readonly privacy_settings?: PrivacySettings;
}

export interface Token {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly token_type: "bearer";
}

export interface LoginRequest {
  readonly login: string;
  readonly password: string;
}

export interface PasswordUpdate {
  readonly current_password: string;
  readonly new_password: string;
}

export type ProfileVisibility = "public" | "private";

export interface PrivacySettings {
  readonly show_uploaded_manga: boolean;
  readonly show_reading_progress: boolean;
  readonly profile_visibility: ProfileVisibility;
}

export type MangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled";

export interface UploadedManga {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly cover_image: string | null;
  readonly status: MangaStatus;
}

export interface PublicUserProfile {
  readonly id: number;
  readonly username: string;
  readonly avatar_url: string | null;
  readonly bio: string | null;
  readonly banner_url: string | null;
  readonly role: UserRole;
  readonly created_at: string;
  readonly rating_count: number;
  readonly manga_count: number;
  readonly privacy_settings: PrivacySettings | null;
  readonly uploaded_manga: UploadedManga[];
}
