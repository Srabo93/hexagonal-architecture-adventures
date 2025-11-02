import { User } from "@application/services/User.ts";
import { UserPersistence } from "@application/outbound_ports/UserPersistence.ts";

export class UserRepository implements UserPersistence {
  private db;
  constructor(db: any) {
    this.db = db;
  }

  findAll(): User[] {
    throw new Error("Method not implemented.");
  }
  findById(id: string): User | null {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): User | null {
    throw new Error("Method not implemented.");
  }
  save(user: User): void {
    this.db.query("INSERT INTO users (name, email, role) VALUES (?, ?, ?)", [
      user.name,
      user.email,
      user.role,
    ]);
  }
  delete(id: string): void {
    throw new Error("Method not implemented.");
  }
}
