import type { ReadingStatus } from "#Application/Aggregates/User/ValueObjects/ReadingStatus.ts";

export interface UserDTO {
  userId: string;
  name: string;
  email: string;

  trackedBooks: Array<{
    isbn: string;
    status: ReadingStatus;
  }>;

  reviews: Array<{
    isbn: string;
    reviewId: string;
    rating: number;
    comment: string;
  }>;
}

export type UserReviewDTO = UserDTO["reviews"][number];
export type UserTrackedBookDTO = UserDTO["trackedBooks"][number];
