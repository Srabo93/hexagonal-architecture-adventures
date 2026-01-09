import type {
  UserReviewDTO,
  UserTrackedBookDTO,
} from "#Adapters/Driving/UserDTO.ts";
import type { User } from "#Application/Aggregates/User.ts";

export interface UserUseCases {
  createUser(userId: string, name: string, email: string): Promise<User>;
  trackBook(
    userId: string,
    isbn: string,
    status: string,
  ): Promise<UserTrackedBookDTO>;
  writeReview(
    userId: string,
    isbn: string,
    review: { reviewId: number; rating: number; comment: string },
  ): Promise<UserReviewDTO>;
  getTrackedBooks(userId: string): Promise<UserTrackedBookDTO[]>;
  getReviews(userId: string): Promise<UserReviewDTO[]>;
}
