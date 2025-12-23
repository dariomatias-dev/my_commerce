import { UserResponse } from "./user-response";

export interface AdminUserResponse extends UserResponse {
  createdAt: string;
}
