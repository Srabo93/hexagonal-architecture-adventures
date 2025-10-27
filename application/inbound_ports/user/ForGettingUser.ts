import { User } from "../../services/User.ts";

export interface ForGettingUser {
  findById(id: string): User | Promise<User>;
}
