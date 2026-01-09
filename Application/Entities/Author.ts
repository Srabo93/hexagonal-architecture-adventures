import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { Name } from "#Application/ValueObjects/Name.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export class Author {
  public get publishedBooks(): ISBN[] {
    return this._publishedBooks;
  }
  public set publishedBooks(value: ISBN[]) {
    this._publishedBooks = value;
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

  public static create(id: UserId, name: Name, publishedBooks: ISBN[]) {
    return new Author(id, name, publishedBooks);
  }
}
