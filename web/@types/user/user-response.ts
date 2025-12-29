export type UserRole = "ADMIN" | "SUBSCRIBER" | "USER";

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enabled: boolean;
}
