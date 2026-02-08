import type { ISBN } from "#Shared/ValueObjects/ISBN.ts";
import { PublishStatus } from "#Shared/ValueObjects/PublishStatus.ts";

import type { Book } from "#Aggregates/Author/Entities/Book.ts";
import type { Name } from "#Aggregates/User/ValueObjects/Name.ts";
import type { UserId } from "#Aggregates/User/ValueObjects/UserId.ts";

/**
 * @class is an Aggregate Root
 */
export class Author {
  private constructor(
    private _version: number,
    private _authorId: UserId,
    private _name: Name,
    private _publishedBooks: Map<string, Book>,
  ) {}

  public static create(id: UserId, name: Name, publishedBooks: Map<string, Book>): Author {
    return new Author(0, id, name, publishedBooks);
  }

  public static rehydrate(
    version: number,
    id: UserId,
    name: Name,
    publishedBooks: Map<string, Book>,
  ): Author {
    return new Author(version, id, name, publishedBooks);
  }

  public get publishedBooks(): Map<string, Book> {
    return this._publishedBooks;
  }
  public get authorId(): UserId {
    return this._authorId;
  }
  public get name(): Name {
    return this._name;
  }
  public set name(value: Name) {
    this._name = value;
  }

  public get version(): number {
    return this._version;
  }

  public bumpVersion() {
    this._version++;
  }

  public publishBook(isbn: ISBN): void {
    const book = this._publishedBooks.get(isbn.isbn);
    if (!book) {
      throw new Error("Book not found");
    }
    if (book.author.authorId.uuid !== this._authorId.uuid) {
      throw new Error("Author can only publish their own books");
    }
    book.published = PublishStatus.published;
  }

  public unpublishBook(isbn: ISBN): void {
    const book = this._publishedBooks.get(isbn.isbn);
    if (!book) {
      throw new Error("Book not found");
    }
    if (book.author.authorId.uuid !== this._authorId.uuid) {
      throw new Error("Author can only unpublish their own books");
    }
    book.published = PublishStatus.unpublished;
  }
}
