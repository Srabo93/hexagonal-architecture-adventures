import type { User } from "#Application/Aggregates/User.ts";
import type { UserRepository } from "#Application/Driven/UserRepository.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

class PostgresUserRepository implements UserRepository {
  constructor() {}
  findById(id: UserId): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  save(user: User): Promise<boolean | Error> {
    throw new Error("Method not implemented.");
  }
}
