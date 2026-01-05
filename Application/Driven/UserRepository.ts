import type { User } from "#Application/Aggregates/User.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<boolean | Error>;
}
