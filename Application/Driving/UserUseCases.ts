import type { Review } from "#Application/Entities/Review.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export interface UserUseCases {
  trackBook(userId: UserId, isbn: ISBN, status: ReadingStatus): void;
  writeReview(userId: UserId, isbn: ISBN, review: Review): void;
  getTrackedBooks(userId: UserId): Map<ISBN, ReadingStatus>;
  getReviews(userId: UserId): Map<ISBN, Review>;
}
