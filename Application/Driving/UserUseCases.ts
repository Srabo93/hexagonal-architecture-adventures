import type {
  UserReviewDTO,
  UserTrackedBookDTO,
} from "#Adapters/Driving/UserDTO.ts";

export interface UserUseCases {
  createUser(userId: string, name: string, email: string): Promise<void>;
  trackBook(userId: string, isbn: string, status: string): Promise<void>;
  writeReview(
    userId: string,
    isbn: string,
    review: { reviewId: number; rating: number; comment: string },
  ): Promise<void>;
  getTrackedBooks(userId: string): Promise<UserTrackedBookDTO[]>;
  getReviews(userId: string): Promise<UserReviewDTO[]>;
}
