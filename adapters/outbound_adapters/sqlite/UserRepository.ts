import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { User } from "@application/services/User.ts";
import { UserPersistence } from "@application/outbound_ports/UserPersistence.ts";

export class UserRepository implements UserPersistence {
  private db;
  constructor(db: DB) {
    this.db = db;
    this.setup();
  }

  private setup() {
    this.db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT CHECK(role IN ('user', 'publisher')) NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
    )
  `);
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
