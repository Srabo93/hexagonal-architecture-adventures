import { ForCreatingUser } from "@application/inbound_ports/user/ForCreatingUser.ts";
import { UserPersistence } from "@application/outbound_ports/UserPersistence.ts";
import { User } from "@application/services/User.ts";

export class UserApi implements ForCreatingUser {
  constructor(private dbRepository: UserPersistence) {}

  create(email: string, name: string, role: "user" | "publisher"): User {
    const newUser = User.create({ email, name, role });
    this.dbRepository.save(newUser);
    return newUser;
  }
}
