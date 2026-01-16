import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as schema from "./schema.ts";

const client = new Client({
  connectionString: process.env.DATABASEURL!,
});

await client.connect();
export const db = drizzle(client, { schema });
export type PostgresDB = typeof db;
