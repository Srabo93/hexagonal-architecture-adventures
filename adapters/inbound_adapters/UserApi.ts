import { ForCreatingUser } from "@application/inbound_ports/user/ForCreatingUser.ts";
import { UserPersistence } from "@application/outbound_ports/UserPersistence.ts";
import { User } from "@application/services/User.ts";
import { ForGettingUser } from "@application/inbound_ports/user/ForGettingUser.ts";
import { UserMapper } from "../anti_corruption_layer/sqlite/UserMapper.ts";

export class UserApi implements ForCreatingUser, ForGettingUser {
  constructor(private dbRepository: UserPersistence) {}

  async findById(id: string): Promise<User> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch user with id ${id}: ${res.status}`);
    }

    const data = await res.json();

    return UserMapper.fromUserApiToDomain(data);
  }

  create(email: string, name: string, role: "user" | "publisher"): User {
    const newUser = User.create({ email, name, role });
    this.dbRepository.save(newUser);
    return newUser;
  }
}
