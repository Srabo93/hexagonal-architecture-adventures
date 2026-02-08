import type { UserReviewDTO, UserTrackedBookDTO } from "#Adapters/Driving/UserDTO.ts";

import type * as User from "../Aggregates/User/User.js";

export interface UserUseCases {
  createUser(userId: string, name: string, email: string): Promise<User.User>;
  trackBook(userId: string, isbn: string, status: string): Promise<UserTrackedBookDTO>;
  writeReview(
    userId: string,
    isbn: string,
    review: { reviewId: number; rating: number; comment: string },
  ): Promise<UserReviewDTO>;
  untrackBook(userId: string, isbn: string): Promise<void>;
  getTrackedBooks(userId: string): Promise<UserTrackedBookDTO[]>;
  getReviews(userId: string): Promise<UserReviewDTO[]>;
}
