import { Author } from "#Application/Aggregates/Author/Author.ts";
import { Book } from "#Application/Aggregates/Author/Entities/Book.ts";
import { Title } from "#Application/Aggregates/Author/ValueObjects/Title.ts";
import { ISBN } from "#Application/Aggregates/Shared/ValueObjects/ISBN.ts";
import { Name } from "#Application/Aggregates/User/ValueObjects/Name.ts";
import { UserId } from "#Application/Aggregates/User/ValueObjects/UserId.ts";
import type { AuthorRepository } from "#Application/Driven/AuthorRepository.ts";

import type { AuthorSnapshot } from "./AuthorSnapshot";

export class JsonAuthorRepository implements AuthorRepository {
  constructor(private readonly authorFilepath: string) {}

  toSnapshot(author: Author): AuthorSnapshot {
    return {
      version: author.version,
      authorId: author.authorId.uuid,
      name: author.name.fullName,
      publishedBooks: Array.from(author.publishedBooks.values()).map((book) => ({
        isbn: book.isbn.isbn,
        title: book.title.title,
        published: book.published,
      })),
    };
  }

  private async loadAllAuthors(): Promise<AuthorSnapshot[]> {
    const file = Bun.file(this.authorFilepath);

    if (!(await file.exists())) {
      return [];
    }

    const content = await file.text();
    return JSON.parse(content);
  }

  async findById(id: UserId): Promise<Author | null> {
    const authors = await this.loadAllAuthors();
    const persistedAuthor = authors.find((author) => author.authorId === id.uuid);

    const books = new Map(
      persistedAuthor?.publishedBooks.map((book) => [
        book.isbn,
        Book.create(
          {
            authorId: UserId.fromPersistence(persistedAuthor.authorId),
            name: Name.fromPersistence(persistedAuthor.name),
          },
          book.published,
          ISBN.fromPersistence(book.isbn),
          Title.fromPersistence(book.title),
        ),
      ]),
    );

    return persistedAuthor
      ? Author.rehydrate(
          persistedAuthor.version,
          UserId.fromPersistence(persistedAuthor.authorId),
          Name.fromPersistence(persistedAuthor.name),
          books,
        )
      : null;
  }

  async save(author: Author): Promise<void> {
    const authorsSnapshots = await this.loadAllAuthors();
    const snapshot = this.toSnapshot(author) satisfies AuthorSnapshot;

    const existingSnapshotIndex = authorsSnapshots.findIndex(
      (a) => a.authorId === snapshot.authorId,
    );

    if (existingSnapshotIndex >= 0) {
      const existing = authorsSnapshots[existingSnapshotIndex];
      if (existing?.version !== author.version) {
        throw new Error("Concurrency conflict: Author was modified");
      }
      const nextSnapshot: AuthorSnapshot = {
        ...this.toSnapshot(author),
        version: author.version + 1,
      };

      authorsSnapshots[existingSnapshotIndex] = nextSnapshot;
    } else {
      const newSnapshot: AuthorSnapshot = {
        ...this.toSnapshot(author),
        version: 1,
      };
      authorsSnapshots.push(newSnapshot);
    }

    const result = await Bun.write(this.authorFilepath, JSON.stringify(authorsSnapshots, null, 2));
    if (typeof result !== "number") {
      throw new Error("Something went wrong to persist the aggregate Author");
    }

    author.bumpVersion();
  }
}
