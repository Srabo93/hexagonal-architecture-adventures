import { inject, injectable } from "tsyringe";

import { ISBN } from "#Application/Aggregates/Shared/ValueObjects/ISBN.ts";
import { Review } from "#Application/Aggregates/User/Entities/Review.ts";
import { User } from "#Application/Aggregates/User/User.ts";
import { Comment } from "#Application/Aggregates/User/ValueObjects/Comment.ts";
import { Email } from "#Application/Aggregates/User/ValueObjects/Email.ts";
import { Name } from "#Application/Aggregates/User/ValueObjects/Name.ts";
import { Rating } from "#Application/Aggregates/User/ValueObjects/Rating.ts";
import { parseReadingStatus } from "#Application/Aggregates/User/ValueObjects/ReadingStatus.ts";
import { ReviewId } from "#Application/Aggregates/User/ValueObjects/ReviewId.ts";
import { UserId } from "#Application/Aggregates/User/ValueObjects/UserId.ts";
import type { UserRepository } from "#Application/Driven/UserRepository.ts";
import type { UserUseCases } from "#Application/Driving/UserUseCases.ts";

import type { UserReviewDTO, UserTrackedBookDTO } from "./UserDTO";

@injectable()
export class CLIUserAdapter implements UserUseCases {
  constructor(@inject("UserRepository") private readonly userRepo: UserRepository) {}

  async writeReview(
    userId: string,
    isbn: string,
    review: { reviewId: any; rating: number; comment: string },
  ): Promise<UserReviewDTO> {
    const user = await this.userRepo.findById(UserId.parse(userId));
    if (!user) throw new Error("User not found");
    const newReview = user.writeReview(
      ISBN.parse(isbn),
      Review.create(
        ReviewId.parse(review.reviewId),
        Rating.parse(Number(review.rating)),
        Comment.parse(review.comment),
      ),
    );

    await this.userRepo.save(user);

    return {
      isbn: isbn,
      reviewId: newReview.reviewId.id,
      rating: newReview.rating.rating,
      comment: newReview.comment.comment,
    } satisfies UserReviewDTO;
  }

  async trackBook(userId: string, isbn: string, status: string): Promise<UserTrackedBookDTO> {
    const user = await this.userRepo.findById(UserId.parse(userId));
    if (!user) throw new Error("User not found");

    const newTrackedBook = user.trackBook(ISBN.parse(isbn), parseReadingStatus(status));
    try {
      await this.userRepo.save(user);
    } catch (error) {
      throw error;
    }

    return {
      isbn: newTrackedBook.isbn.isbn,
      status: newTrackedBook.status,
    } satisfies UserTrackedBookDTO;
  }

  async getTrackedBooks(userId: string): Promise<UserTrackedBookDTO[]> {
    const user = await this.userRepo.findById(UserId.parse(userId));
    if (!user) throw new Error("User not found");

    return user.trackedBooks.map((tracked) => ({
      isbn: tracked.isbn.isbn,
      status: tracked.status,
    }));
  }

  async getReviews(userId: string): Promise<UserReviewDTO[]> {
    const user = await this.userRepo.findById(UserId.parse(userId));
    if (!user) throw new Error("User not found");

    return user.reviews.map((reviewed) => ({
      isbn: reviewed.isbn,
      reviewId: reviewed.review.reviewId.id,
      rating: reviewed.review.rating.rating,
      comment: reviewed.review.comment.comment,
    }));
  }

  async createUser(userId: string, name: string, email: string): Promise<User> {
    const user = User.create(UserId.parse(userId), Name.parse(name), Email.parse(email));
    await this.userRepo.save(user);

    return user;
  }

  async untrackBook(userId: string, isbn: string): Promise<void> {
    const user = await this.userRepo.findById(UserId.parse(userId));
    if (!user) throw new Error("User not found");

    user.untrackBook(ISBN.parse(isbn));
    await this.userRepo.save(user);
  }
}
