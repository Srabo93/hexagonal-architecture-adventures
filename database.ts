import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { SqliteSeeder } from "./admin/SqliteSeeder.ts";
import { UserPersistence } from "@application/outbound_ports/UserPersistence.ts";
import { CountryTaxPersistence } from "@application/outbound_ports/CountryTaxPersistence.ts";

let dbInstance: DB | null = null;

export function getDatabase(env: string) {
  if (dbInstance) return dbInstance;

  const dbFile = env === "prod" ? "hexagonal_app.sqlite" : "dev.sqlite";
  dbInstance = new DB(dbFile);
  return dbInstance;
}

export function migrate(db: DB) {
  db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT CHECK(role IN ('user', 'publisher')) NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
    )
  `);

  db.execute(`
      CREATE TABLE IF NOT EXISTS country_taxes (
        country TEXT PRIMARY KEY,
        tax_rate REAL NOT NULL
      )
    `);
}

function isSeeded(db: DB): boolean {
  const rows = [...db.query("SELECT COUNT(*) FROM users")];
  const count = rows[0][0] as number;
  return count > 0;
}

export function seedIfNeeded(
  userRepo: UserPersistence,
  taxRepo: CountryTaxPersistence,
  db: DB,
) {
  if (isSeeded(db)) {
    console.log("✅ Database already seeded, skipping.");
    return;
  }

  const seeder = new SqliteSeeder(taxRepo, userRepo);
  seeder.seed();
  console.log("🌱 Database seeded.");
}
