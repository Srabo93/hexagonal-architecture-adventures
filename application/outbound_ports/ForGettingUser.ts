import { UserRecord } from "@adapters/outbound_adapters/sqlite/models/UserRecord.ts";
import { User } from "../services/User.ts";

export interface ForGettingUsers {
  findAll(): UserRecord[];

  findById(id: string): UserRecord | null;

  findByEmail(email: string): UserRecord | null;

  save(user: User): void;

  delete(id: string): void;
}
