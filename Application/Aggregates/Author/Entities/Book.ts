import type { Author } from "#Aggregates/Author/Author.js";
import type { ISBN } from "#Shared/ValueObjects/ISBN.js";
import { PublishStatus } from "#Shared/ValueObjects/PublishStatus.js";
import type { Title } from "#Aggregates/Author/ValueObjects/Title.js";

/**
 * @class is an Entity
 */
export class Book {
  public get author(): Pick<Author, "authorId" | "name"> {
    return this._author;
  }
  public get published(): PublishStatus {
    return this._published;
  }
  public set published(value: PublishStatus) {
    this._published = value;
  }
  public get title(): Title {
    return this._title;
  }
  public get isbn(): ISBN {
    return this._isbn;
  }

  private constructor(
    private _author: Pick<Author, "authorId" | "name">,
    private _published: PublishStatus,
    private _isbn: ISBN,
    private _title: Title,
  ) {}

  static create(
    author: Pick<Author, "authorId" | "name">,
    published: PublishStatus,
    isbn: ISBN,
    title: Title,
  ): Book {
    return new Book(author, published, isbn, title);
  }

  static rehydrate(
    author: Pick<Author, "authorId" | "name">,
    published: PublishStatus,
    isbn: ISBN,
    title: Title,
  ): Book {
    return new Book(author, published, isbn, title);
  }
}
