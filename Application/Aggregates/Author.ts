import type { Book } from "#Application/Entities/Book.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { Name } from "#Application/ValueObjects/Name.ts";
import { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

/**
 * @class is an Aggregate Root
 */
export class Author {
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

  private constructor(
    private _authorId: UserId,
    private _name: Name,
    private _publishedBooks: Map<string, Book>,
  ) {}

  public static create(id: UserId, name: Name, publishedBooks: Map<string, Book>): Author {
    return new Author(id, name, publishedBooks);
  }

  public static rehydrate(id: UserId, name: Name, publishedBooks: Map<string, Book>): Author {
    return new Author(id, name, publishedBooks);
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
