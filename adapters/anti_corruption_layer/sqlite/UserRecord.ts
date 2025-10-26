import { User } from "@application/services/User.ts";

export interface UserRecord {
  id: string;
  user: User;
  createdAt: string;
}
