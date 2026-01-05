import type { UserUseCases } from "#Application/Driving/UserUseCases.ts";
import type { Review } from "#Application/Entities/Review.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export class CLIUserAdapter implements UserUseCases {
  constructor() {}
  trackBook(userId: UserId, isbn: ISBN, status: ReadingStatus): void {
    // get aggregate from DB
    // add new book to the aggregate
    // persist the aggregate in the db
  }
  writeReview(userId: UserId, isbn: ISBN, review: Review): void {
    throw new Error("Method not implemented.");
  }
  getTrackedBooks(userId: UserId): Map<ISBN, ReadingStatus> {
    throw new Error("Method not implemented.");
  }
  getReviews(userId: UserId): Map<ISBN, Review> {
    throw new Error("Method not implemented.");
  }
}
