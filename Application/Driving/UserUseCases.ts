import type { Review } from "#Application/Entities/Review.ts";
import type { TrackedBook } from "#Application/Entities/TrackedBook.ts";

export interface UserUseCases {
  createUser(userId: string, name: string, email: string): Promise<void>;
  trackBook(userId: string, isbn: string, status: string): Promise<void>;
  writeReview(
    userId: string,
    isbn: string,
    review: { reviewId: number; rating: number; comment: string },
  ): Promise<void>;
  getTrackedBooks(userId: string): Promise<TrackedBook[]>;
  getReviews(
    userId: string,
  ): Promise<ReadonlyArray<{ isbn: string; review: Review }>>;
}
