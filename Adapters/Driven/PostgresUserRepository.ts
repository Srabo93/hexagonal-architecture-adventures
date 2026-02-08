import type { PostgresDB } from "DB/Postgres/client";
import { reviews, trackedBooks, users } from "DB/Postgres/schema";
import { Name, and, eq } from "drizzle-orm";

import { ISBN } from "#Application/Aggregates/Shared/ValueObjects/ISBN.ts";
import type { Review } from "#Application/Aggregates/User/Entities/Review.ts";
import type { TrackedBook } from "#Application/Aggregates/User/Entities/TrackedBook.ts";
import type { User } from "#Application/Aggregates/User/User.ts";
import { Comment } from "#Application/Aggregates/User/ValueObjects/Comment.ts";
import { Email } from "#Application/Aggregates/User/ValueObjects/Email.ts";
import { Rating } from "#Application/Aggregates/User/ValueObjects/Rating.ts";
import { ReviewId } from "#Application/Aggregates/User/ValueObjects/ReviewId.ts";
import type { UserId } from "#Application/Aggregates/User/ValueObjects/UserId.ts";
import type { UserRepository } from "#Application/Driven/UserRepository.ts";

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly _db: PostgresDB) {}

  async findById(id: UserId): Promise<User | null> {
    const user = await this._db.query.users.findFirst({
      where: eq(users.id, id.uuid),
      with: {
        trackedBooks: true,
        reviews: true,
      },
    });

    if (user === undefined) {
      return null;
    }

    const trackedBooks = new Map<string, TrackedBook>();
    user.trackedBooks.forEach((trackedBook) => {
      trackedBooks.set(
        trackedBook.isbn,
        TrackedBook.rehydrate(ISBN.fromPersistence(trackedBook.isbn), trackedBook.status),
      );
    });

    const reviews = new Map<string, Review>();
    user.reviews.forEach((review) => {
      reviews.set(
        review.trackedBookIsbn,
        Review.rehydrate(
          ReviewId.fromPersistence(review.id),
          Rating.fromPersistence(review.rating ?? 0),
          Comment.fromPersistence(review.comment ?? ""),
        ),
      );
    });

    return User.rehydrate(
      user.version,
      UserId.fromPersistence(user.id),
      Name.fromPersistence(user.name),
      Email.fromPersistence(user.email),
      trackedBooks,
      reviews,
    );
  }

  async save(user: User): Promise<void> {
    await this._db.transaction(async (tx) => {
      const result = await tx
        .update(users)
        .set({
          name: user.name.fullName,
          email: user.email.email,
          version: user.version + 1,
        })
        .where(and(eq(users.id, user.userId.uuid), eq(users.version, user.version)));

      if (result.rowCount === 0) {
        throw new Error("Concurrency conflict: User was modified by another process");
      }

      await tx.delete(trackedBooks).where(eq(trackedBooks.userId, user.userId.uuid));

      await tx.insert(trackedBooks).values(
        Array.from(user.trackedBooks.values()).map((tb) => ({
          isbn: tb.isbn.isbn,
          status: tb.status,
          userId: user.userId.uuid,
        })),
      );

      await tx.delete(reviews).where(eq(reviews.userId, user.userId.uuid));

      await tx.insert(reviews).values(
        Array.from(user.reviews.values()).map((r) => ({
          id: r.review.reviewId.id,
          rating: r.review.rating.rating ?? null,
          comment: r.review.comment.comment ?? null,
          userId: user.userId.uuid,
          trackedBookIsbn: r.isbn,
        })),
      );
    });

    user.bumpVersion();
  }
}
