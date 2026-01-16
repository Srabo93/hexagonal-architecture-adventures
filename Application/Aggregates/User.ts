import { Review } from "#Application/Entities/Review.ts";
import { TrackedBook } from "#Application/Entities/TrackedBook.ts";
import type { Email } from "#Application/ValueObjects/Email.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { Name } from "#Application/ValueObjects/Name.ts";
import { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export class User {
  private constructor(
    private _version: number,
    private _userId: UserId,
    private _name: Name,
    private _email: Email,
    private _trackedBooks: Map<string, TrackedBook>,
    private _reviews: Map<string, Review>,
  ) {}

  static create(version: number = 1, userId: UserId, name: Name, email: Email): User {
    return new User(version, userId, name, email, new Map(), new Map());
  }

  static rehydrate(
    version: number,
    userId: UserId,
    name: Name,
    email: Email,
    trackedBooks: Map<string, TrackedBook>,
    reviews: Map<string, Review>,
  ): User {
    return new User(version, userId, name, email, trackedBooks, reviews);
  }

  public get version(): number {
    return this._version;
  }

  public bumpVersion() {
    this._version++;
  }

  public set name(value: Name) {
    this._name = value;
  }

  public get name(): Name {
    return this._name;
  }

  public get email(): Email {
    return this._email;
  }

  public get userId(): UserId {
    return this._userId;
  }

  public get trackedBooks(): TrackedBook[] {
    return Array.from(this._trackedBooks.values());
  }

  public get reviews(): ReadonlyArray<{ isbn: string; review: Review }> {
    return Array.from(this._reviews.entries()).map(([isbn, review]) => ({
      isbn,
      review,
    }));
  }

  public trackBook(isbn: ISBN, status: ReadingStatus) {
    if (this._trackedBooks.has(isbn.isbn)) {
      throw new Error("book already tracked");
    }

    this._trackedBooks.set(isbn.isbn, TrackedBook.create(isbn, status));

    const newTrackedBook = this._trackedBooks.get(isbn.isbn);

    if (!newTrackedBook) {
      throw new Error("New Tracked book could not be found");
    }

    return newTrackedBook;
  }

  public writeReview(isbn: ISBN, review: Review) {
    const isBookTracked = this._trackedBooks.has(isbn.isbn);
    if (!isBookTracked) {
      throw new Error("book is not tracked");
    }

    const trackedBook = this._trackedBooks.get(isbn.isbn);
    if (trackedBook?.status !== "Read") {
      throw new Error("book has to be read before reviewed");
    }

    this._reviews.set(isbn.isbn, review);

    const newReview = this._reviews.get(isbn.isbn);

    if (!newReview) {
      throw new Error("Latest Review not found");
    }

    return newReview;
  }

  public untrackBook(isbn: ISBN): void {
    if (!this._trackedBooks.has(isbn.isbn)) {
      throw new Error("book is not tracked");
    }
    this._trackedBooks.delete(isbn.isbn);
  }
}
