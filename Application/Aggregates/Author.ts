import type { Book } from "#Application/Entities/Book.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { Name } from "#Application/ValueObjects/Name.ts";
import { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";
import type { Title } from "#Application/ValueObjects/Title.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

/**
 * @class is an Aggregate Root
 */
export class Author {
  public get publishedBooks(): ISBN[] {
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
    private _publishedBooks: ISBN[],
  ) {}

  public static create(id: UserId, name: Name, publishedBooks: ISBN[]): Author {
    return new Author(id, name, publishedBooks);
  }

  public static rehydrate(
    id: UserId,
    name: Name,
    publishedBooks: ISBN[],
  ): Author {
    return new Author(id, name, publishedBooks);
  }

  public publishBook(book: Book): void {
    // Author aggregate coordinates with Book to publish
    if (book.author.authorId.uuid !== this._authorId.uuid) {
      throw new Error("Author can only publish their own books");
    }
    book.published = PublishStatus.published;
    
    // Track published book if not already tracked
    if (!this._publishedBooks.some(isbn => isbn.isbn === book.isbn.isbn)) {
      this._publishedBooks.push(book.isbn);
    }
  }

  public unpublishBook(book: Book): void {
    // Author aggregate coordinates with Book to unpublish
    if (book.author.authorId.uuid !== this._authorId.uuid) {
      throw new Error("Author can only unpublish their own books");
    }
    book.published = PublishStatus.unpublished;
  }
}
