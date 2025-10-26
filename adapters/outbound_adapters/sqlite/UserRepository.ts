import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { UserRecord } from "./models/UserRecord.ts";
import { ForGettingUsers } from "@application/outbound_ports/ForGettingUser.ts";
import { User } from "@application/services/User.ts";

export class UserRepository implements ForGettingUsers {
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

  findAll(): UserRecord[] {
    throw new Error("Method not implemented.");
  }
  findById(id: string): UserRecord | null {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): UserRecord | null {
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
