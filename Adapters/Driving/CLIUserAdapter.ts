import { Book } from "#Application/Aggregates/Book.ts";
import { User } from "#Application/Aggregates/User.ts";
import type { UserRepository } from "#Application/Driven/UserRepository.ts";
import type { UserUseCases } from "#Application/Driving/UserUseCases.ts";
import { Review } from "#Application/Entities/Review.ts";
import { Comment } from "#Application/ValueObjects/Comment.ts";
import { Email } from "#Application/ValueObjects/Email.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { Rating } from "#Application/ValueObjects/Rating.ts";
import { parseReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";
import { ReviewId } from "#Application/ValueObjects/ReviewId.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";
import type { UserReviewDTO, UserTrackedBookDTO } from "./UserDTO";

export class CLIUserAdapter implements UserUseCases {
  constructor(private readonly userRepo: UserRepository) {}

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
        Rating.parseInteger(Number(review.rating)),
        Comment.parse(review.comment),
      ),
    );

    const isSuccessfull = await this.userRepo.save(user);
    if (!isSuccessfull) {
      throw isSuccessfull;
    }

    return {
      isbn: isbn,
      reviewId: newReview.reviewId.id,
      rating: newReview.rating.rating,
      comment: newReview.comment.comment,
    } satisfies UserReviewDTO;
  }

  async trackBook(
    userId: string,
    isbn: string,
    status: string,
  ): Promise<UserTrackedBookDTO> {
    const user = await this.userRepo.findById(UserId.parse(userId));
    if (!user) throw new Error("User not found");

    const newTrackedBook = user.trackBook(
      ISBN.parse(isbn),
      parseReadingStatus(status),
    );
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
    const user = User.create(
      UserId.parse(userId),
      Name.parse(name),
      Email.parse(email),
    );
    const isSuccessfull = await this.userRepo.save(user);

    if (!isSuccessfull) {
      throw isSuccessfull;
    }
    return user;
  }
}
