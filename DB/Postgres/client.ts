import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as schema from "./schema.ts";

export async function createPostgresDB() {
  const client = new Client({
    connectionString: process.env.DATABASEURL!,
  });

  await client.connect();
  return drizzle(client, { schema });
}
export type PostgresDB = Awaited<ReturnType<typeof createPostgresDB>>;
