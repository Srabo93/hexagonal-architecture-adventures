import { User } from "../../services/User.ts";

export interface ForCreatingUser {
  create(email: string, name: string, role: "user" | "publisher"): User;
}
