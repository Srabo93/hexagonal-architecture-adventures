import { User } from "@application/services/User.ts";
import { UserRecord } from "./UserRecord.ts";

export class UserMapper {
  static toDomain(record: UserRecord): User {
    const user = User.create({
      name: record.user.name,
      email: record.user.email,
      role: record.user.role,
    });
    return user;
  }
}
