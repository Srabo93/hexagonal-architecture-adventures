import { Author } from "#Application/Aggregates/Author.ts";
import type { AuthorRepository } from "#Application/Driven/AuthorRepository.ts";
import { Book } from "#Application/Entities/Book.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { Title } from "#Application/ValueObjects/Title.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";

import type { AuthorSnapshot } from "./AuthorSnapshot";

export class JsonAuthorRepository implements AuthorRepository {
  constructor(private readonly authorFilepath: string) {}

  toSnapshot(author: Author): AuthorSnapshot {
    return {
      version: author.version,
      authorId: author.authorId.uuid,
      name: author.name.fullName(),
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
            authorId: UserId.parse(persistedAuthor.authorId),
            name: Name.parse(persistedAuthor.name),
          },
          book.published,
          ISBN.parse(book.isbn),
          Title.parse(book.title),
        ),
      ]),
    );

    return persistedAuthor
      ? Author.rehydrate(
          persistedAuthor.version,
          UserId.parse(persistedAuthor.authorId),
          Name.parse(persistedAuthor.name),
          books,
        )
      : null;
  }

  async save(author: Author): Promise<boolean | Error> {
    const authors = await this.loadAllAuthors();
    const snapshot = this.toSnapshot(author) satisfies AuthorSnapshot;

    const index = authors.findIndex((a) => a.authorId === snapshot.authorId);

    if (index >= 0) {
      authors[index] = snapshot;
    } else {
      authors.push(snapshot);
    }

    try {
      const isSuccessfull = await Bun.write(this.authorFilepath, JSON.stringify(authors, null, 2));

      if (!(typeof isSuccessfull === "number")) {
        throw new Error("Something went wrong to persist the aggregate Author");
      }
      author.bumpVersion();
    } catch (error) {
      throw error;
    }
    return true;
  }
}
