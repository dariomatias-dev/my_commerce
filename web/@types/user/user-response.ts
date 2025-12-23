export type UserRole = "ADMIN" | "USER";

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enabled: boolean;
}
