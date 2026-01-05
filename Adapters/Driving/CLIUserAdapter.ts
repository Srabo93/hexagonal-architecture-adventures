import { User } from "#Application/Aggregates/User.ts";
import type { UserRepository } from "#Application/Driven/UserRepository.ts";
import type { UserUseCases } from "#Application/Driving/UserUseCases.ts";
import type { Review } from "#Application/Entities/Review.ts";
import type { TrackedBook } from "#Application/Entities/TrackedBook.ts";
import { Email } from "#Application/ValueObjects/Email.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { parseReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";

export class CLIUserAdapter implements UserUseCases {
  constructor(private readonly userRepo: UserRepository) {}

  async writeReview(
    userId: string,
    isbn: string,
    review: { reviewId: number; rating: number; comment: string },
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async trackBook(userId: string, isbn: string, status: string): Promise<void> {
    const user = await this.userRepo.findById(UserId.parse(userId));
    if (!user) throw new Error("User not found");

    user.trackBook(ISBN.parse(isbn), parseReadingStatus(status));
    await this.userRepo.save(user);
  }

  async getTrackedBooks(userId: string): Promise<TrackedBook[]> {
    const user = await this.userRepo.findById(UserId.parse(userId));
    if (!user) throw new Error("User not found");

    return user.trackedBooks;
  }

  async getReviews(userId: UserId): Promise<Review[]> {
    throw new Error("Method not implemented.");
  }

  async createUser(userId: string, name: string, email: string): Promise<void> {
    const user = User.create(
      UserId.parse(userId),
      Name.parse(name),
      Email.parse(email),
    );
    await this.userRepo.save(user);
  }
}
