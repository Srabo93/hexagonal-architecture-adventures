import type { User } from "#Aggregates/User/User.js";
import type { UserId } from "#Aggregates/User/ValueObjects/UserId.js";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
}
