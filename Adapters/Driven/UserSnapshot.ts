import type { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";

export interface UserSnapshot {
  version: number;
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
