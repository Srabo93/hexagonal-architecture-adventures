import { seed } from "drizzle-seed";

import { createPostgresDB } from "./client";
import * as schema from "./schema.ts";

async function main() {
  const db = await createPostgresDB();

  // Clear existing data
  await db.delete(schema.users);
  await db.delete(schema.authors);
  await db.delete(schema.books);

  await seed(db, {
    users: schema.users,
    authors: schema.authors,
    books: schema.books,
    trackedBooks: schema.trackedBooks,
  }).refine((f) => ({
    users: {
      count: 5,
      columns: {
        version: f.default({ defaultValue: 1 }),
        name: f.valuesFromArray({
          values: ["John Doe", "Jane Smith", "Bob Wilson", "Alice Brown", "Charlie Davis"],
        }),
        email: f.valuesFromArray({
          values: [
            "john@example.com",
            "jane@example.com",
            "bob@example.com",
            "alice@example.com",
            "charlie@example.com",
          ],
        }),
      },
      with: {
        trackedBooks: 2,
      },
    },
    authors: {
      count: 5,
      columns: {
        version: f.default({ defaultValue: 1 }),
        name: f.valuesFromArray({
          values: [
            "Stephen King",
            "J.K. Rowling",
            "George Orwell",
            "Agatha Christie",
            "Mark Twain",
          ],
        }),
      },
      with: {
        books: 3,
      },
    },
    books: {
      count: 15,
      columns: {
        title: f.valuesFromArray({
          values: [
            "The Great Adventure",
            "Mystery Tonight",
            "Love Story",
            "Sci-Fi Epic",
            "Fantasy Quest",
          ],
        }),
        published: f.valuesFromArray({ values: ["Published", "Unpublished"] }),
      },
    },
  }));
}

main()
  .catch((err) => {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  })
  .finally(() => console.log("Seeder succeeded"));
