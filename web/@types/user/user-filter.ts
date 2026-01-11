import { UserRole } from "./user-response";

export interface UserFilterDTO {
  name?: string;
  email?: string;
  role?: UserRole;
}
