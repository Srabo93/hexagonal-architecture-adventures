import { Review } from "#Application/Entities/Review.ts";
import { TrackedBook } from "#Application/Entities/TrackedBook.ts";
import type { Email } from "#Application/ValueObjects/Email.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { Name } from "#Application/ValueObjects/Name.ts";
import { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export class User {
  private constructor(
    private _userId: UserId,
    private _name: Name,
    private _email: Email,
    private _trackedBooks: Map<ISBN, TrackedBook>,
    private _reviews: Map<ISBN, Review>,
  ) {}

  static create(userId: UserId, name: Name, email: Email): User {
    return new User(userId, name, email, new Map(), new Map());
  }

  static rehydrate(
    userId: UserId,
    name: Name,
    email: Email,
    trackedBooks: Map<ISBN, TrackedBook>,
    review: Map<ISBN, Review>,
  ): User {
    return new User(userId, name, email, trackedBooks, review);
  }

  toSnapshot() {
    return {
      userId: this._userId.uuid,
      name: this._name.fullName(),
      email: this._email.email,

      trackedBooks: Array.from(this._trackedBooks.values()).map((tb) => ({
        isbn: tb.isbn.isbn,
        status: tb.status,
      })),

      reviews: Array.from(this._reviews.entries()).map(([isbn, review]) => ({
        isbn: isbn.isbn,
        reviewId: review.reviewId,
        rating: review.rating,
        comment: review.comment,
      })),
    };
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
