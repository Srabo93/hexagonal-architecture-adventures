import { User } from "../services/User.ts";

export interface UserPersistence {
  findAll(): User[];
  findById(id: string): User | null;
  findByEmail(email: string): User | null;
  save(user: User): void;
  delete(id: string): void;
}
