import type { User } from "@/types/user.types";
import { UserRole } from "@/types/user.types";

export const hasRole = (user: User | undefined, role: UserRole): boolean => {
  if (!user) return false;

  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.USER]: 1,
    [UserRole.UPLOADER]: 2,
    [UserRole.MODERATOR]: 3,
    [UserRole.ADMIN]: 4,
  };

  return roleHierarchy[user.role] >= roleHierarchy[role];
};

export const canUpload = (user: User | undefined): boolean => {
  return hasRole(user, UserRole.UPLOADER);
};

export const canModerate = (user: User | undefined): boolean => {
  return hasRole(user, UserRole.MODERATOR);
};

export const isAdmin = (user: User | undefined): boolean => {
  return user?.role === UserRole.ADMIN;
};
