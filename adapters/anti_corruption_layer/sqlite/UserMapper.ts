import { User } from "@application/services/User.ts";
import { UserApiRecord, UserRecord } from "./UserRecord.ts";

export class UserMapper {
  static fromPersistenceToUser(record: UserRecord): User {
    const user = User.create({
      name: record.user.name,
      email: record.user.email,
      role: record.user.role,
    });
    return user;
  }

  static fromUserApiToDomain(resource: UserApiRecord): User {
    const user = User.create({
      name: resource.name,
      email: resource.email,
    });
    return user;
  }
}
