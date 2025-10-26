import { randomUUID } from "node:crypto";
import { User } from "@application/services/User.ts";
import { UserPersistence } from "@application/outbound_ports/UserPersistence.ts";
import { UserRecord } from "@adapters/anti_corruption_layer/sqlite/UserRecord.ts";
import { UserMapper } from "@adapters/anti_corruption_layer/sqlite/UserMapper.ts";

export class InMemoryUserRepository implements UserPersistence {
  private memory: Map<string, UserRecord>;

  constructor(initialData: UserRecord[] = []) {
    this.memory = new Map(
      initialData.map((user) => {
        return [user.id, user];
      }),
    );
  }

  findAll(): User[] {
    return Array.from(this.memory.values()).map((record) =>
      UserMapper.toDomain(record),
    );
  }

  findById(id: string): User | null {
    const record = this.memory.get(id);
    return record ? UserMapper.toDomain(record) : null;
  }

  findByEmail(email: string): User | null {
    const record = Array.from(this.memory.values()).find(
      (r) => r.user.email === email,
    );
    return record ? UserMapper.toDomain(record) : null;
  }

  save(user: User): void {
    const id = randomUUID();
    this.memory.set(id, {
      id,
      user,
      createdAt: new Date().toISOString(),
    });
  }

  delete(id: string): void {
    this.memory.delete(id);
  }
}
