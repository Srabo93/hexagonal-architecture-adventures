import { Review } from "#Application/Entities/Review.ts";
import { TrackedBook } from "#Application/Entities/TrackedBook.ts";
import type { Email } from "#Application/ValueObjects/Email.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { Name } from "#Application/ValueObjects/Name.ts";
import { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export class User {
  private constructor(
    private _userId: UserId,
    private _name: Name,
    private _email: Email,
    private _trackedBooks: Map<string, TrackedBook>,
    private _reviews: Map<string, Review>,
  ) {}

  static create(userId: UserId, name: Name, email: Email): User {
    return new User(userId, name, email, new Map(), new Map());
  }

  static rehydrate(
    userId: UserId,
    name: Name,
    email: Email,
    trackedBooks: Map<string, TrackedBook>,
    review: Map<string, Review>,
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
        isbn: isbn,
        reviewId: review.reviewId.id,
        rating: review.rating.rating,
        comment: review.comment.comment,
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

    this._trackedBooks.set(isbn.isbn, new TrackedBook(isbn, status));
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
  }
}
