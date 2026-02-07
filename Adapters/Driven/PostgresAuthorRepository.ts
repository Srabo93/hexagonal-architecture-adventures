import type { PostgresDB } from "DB/Postgres/client";
import { authors, books } from "DB/Postgres/schema";
import { and, eq } from "drizzle-orm";

import { Author } from "#Application/Aggregates/Author.ts";
import type { AuthorRepository } from "#Application/Driven/AuthorRepository.ts";
import { Book } from "#Application/Entities/Book.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { Title } from "#Application/ValueObjects/Title.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";

export class PostgresAuthorRepository implements AuthorRepository {
  constructor(private readonly _db: PostgresDB) {}

  async findById(id: UserId): Promise<Author | null> {
    const author = await this._db.query.authors.findFirst({
      where: eq(authors.id, id.uuid),
      with: {
        books: true,
      },
    });

    if (author === undefined) return null;

    const books = new Map<string, Book>();

    author.books.forEach((publishedBook) => {
      books.set(
        publishedBook.isbn,
        Book.rehydrate(
          { authorId: UserId.parse(author.id), name: Name.parse(author.name) },
          publishedBook.published,
          ISBN.parse(publishedBook.isbn),
          Title.parse(publishedBook.title),
        ),
      );
    });

    return Author.rehydrate(
      author.version,
      UserId.parse(author.id),
      Name.parse(author.name),
      books,
    );
  }

  async save(author: Author): Promise<void> {
    await this._db.transaction(async (tx) => {
      const result = await tx
        .update(authors)
        .set({
          version: author.version,
          id: author.authorId.uuid,
          name: author.name.fullName,
        })
        .where(and(eq(authors.id, author.authorId.uuid), eq(authors.version, author.version)));

      if (result.rowCount === 0) {
        throw new Error("Concurrency conflict: Author was modified by another process");
      }

      await tx.delete(books).where(eq(books.authorId, author.authorId.uuid));

      const booksToInsert = Array.from(author.publishedBooks.values()).map((publishedBook) => ({
        isbn: publishedBook.isbn.isbn,
        title: publishedBook.title.title,
        published: publishedBook.published,
        authorId: publishedBook.author.authorId.uuid,
      }));

      if (booksToInsert.length > 0) {
        await tx.insert(books).values(booksToInsert);
      }
    });

    author.bumpVersion();
  }
}
