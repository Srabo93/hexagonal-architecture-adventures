import { Review } from "#Application/Entities/Review.ts";
import { TrackedBook } from "#Application/Entities/TrackedBook.ts";
import type { Email } from "#Application/ValueObjects/Email.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { Name } from "#Application/ValueObjects/Name.ts";
import { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export class User {
  constructor(
    private _userId: UserId,
    private _name: Name,
    private _email: Email,
    private _trackedBooks: Map<ISBN, TrackedBook>,
    private _reviews: Map<ISBN, Review>,
  ) {}

  public get name(): Name {
    return this._name;
  }

  public get email(): Email {
    return this._email;
  }

  public get userId(): UserId {
    return this._userId;
  }

  public trackBook(isbn: ISBN, status: ReadingStatus) {
    if (this._trackedBooks.has(isbn)) {
      throw new Error("book already tracked");
    }

    this._trackedBooks.set(isbn, new TrackedBook(isbn, status));
  }

  public writeReview(isbn: ISBN, review: Review) {
    const isBookTracked = this._trackedBooks.has(isbn);
    if (!isBookTracked) {
      throw new Error("book is not tracked");
    }

    const trackedBook = this._trackedBooks.get(isbn);
    if (trackedBook?.status !== "Read") {
      throw new Error("book has to be read before reviewed");
    }

    this._reviews.set(isbn, review);
  }
}
