import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import { authors, books, reviews, trackedBooks, users } from "./db/schema";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASEURL!,
  });
  await client.connect();
  const db = drizzle(client);

  // ---------- 2. Create sample users ----------
  const sampleUsers = [
    { id: crypto.randomUUID(), name: "Alice", email: "alice@example.com" },
    { id: crypto.randomUUID(), name: "Bob", email: "bob@example.com" },
    { id: crypto.randomUUID(), name: "Charlie", email: "charlie@example.com" },
  ];
  await db.insert(users).values(sampleUsers);

  // ---------- 3. Create sample authors ----------
  const sampleAuthors = [
    { id: crypto.randomUUID(), name: "J.K. Rowling" },
    { id: crypto.randomUUID(), name: "George R.R. Martin" },
    { id: crypto.randomUUID(), name: "Brandon Sanderson" },
  ];
  await db.insert(authors).values(sampleAuthors);

  // ---------- 4. Create sample books ----------
  const sampleBooks = [
    {
      isbn: crypto.randomUUID(),
      title: "Harry Potter and the Sorcerer's Stone",
      published: "Published" as const,
      authorId: sampleAuthors[0].id,
    },
    {
      isbn: crypto.randomUUID(),
      title: "A Game of Thrones",
      published: "Published" as const,
      authorId: sampleAuthors[1].id,
    },
    {
      isbn: crypto.randomUUID(),
      title: "Mistborn: The Final Empire",
      published: "Published" as const,
      authorId: sampleAuthors[2].id,
    },
  ];
  await db.insert(books).values(sampleBooks);

  // ---------- 5. Assign tracked books to users ----------
  const trackedBooksData: (typeof trackedBooks.$inferInsert)[] = [];

  sampleUsers.forEach((user, i) => {
    // Each user tracks 2 books
    const book1 = sampleBooks[i % sampleBooks.length];
    const book2 = sampleBooks[(i + 1) % sampleBooks.length];

    trackedBooksData.push(
      { isbn: crypto.randomUUID(), status: "WantToRead", userId: user.id },
      { isbn: crypto.randomUUID(), status: "Reading", userId: user.id },
    );
  });

  await db.insert(trackedBooks).values(trackedBooksData);

  // ---------- 6. Add reviews for some tracked books ----------
  const reviewsData: (typeof reviews.$inferInsert)[] = trackedBooksData.map((tb, i) => ({
    id: crypto.randomUUID(),
    rating: Math.floor(Math.random() * 5) + 1, // 1–5 stars
    comment: "This is a sample review.",
    userId: sampleUsers[i % sampleUsers.length].id,
    trackedBookIsbn: tb.isbn,
  }));

  await db.insert(reviews).values(reviewsData);

  console.log("✅ Database seeded successfully!");
  await client.end();
}

// Run seeder
main().catch((err) => {
  console.error("❌ Seeder failed:", err);
  process.exit(1);
});
