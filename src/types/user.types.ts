export enum UserRole {
  USER = "user",
  UPLOADER = "uploader",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

export interface User {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly gender: "male" | "female";
  readonly avatar_url: string | undefined;
  readonly role: UserRole;
  readonly is_active: boolean;
  readonly created_at: string;
}

export interface UserCreate {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly gender: "male" | "female";
}

export interface UserUpdate {
  readonly username?: string;
  readonly email?: string;
  readonly avatar_url?: string;
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
