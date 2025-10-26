import { randomUUID } from "node:crypto";
import { UserRecord } from "@adapters/outbound_adapters/sqlite/models/UserRecord.ts";
import { User } from "@application/services/User.ts";
import { ForGettingUsers } from "@application/outbound_ports/ForGettingUser.ts";

export class InMemoryUserRepository implements ForGettingUsers {
  private memory: Map<string, UserRecord>;

  constructor(initialData: UserRecord[] = []) {
    this.memory = new Map(
      initialData.map((user) => {
        return [user.id, user];
      }),
    );
  }

  findAll(): UserRecord[] {
    return Array.from(this.memory.values()).map((record) => record);
  }

  findById(id: string): UserRecord | null {
    const record = this.memory.get(id);
    return record ? record : null;
  }

  findByEmail(email: string): UserRecord | null {
    const record = Array.from(this.memory.values()).find(
      (r) => r.user.email === email,
    );
    return record ? record : null;
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
