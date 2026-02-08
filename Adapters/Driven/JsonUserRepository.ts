import { ISBN } from "#Application/Aggregates/Shared/ValueObjects/ISBN.ts";
import { Review } from "#Application/Aggregates/User/Entities/Review.ts";
import { TrackedBook } from "#Application/Aggregates/User/Entities/TrackedBook.ts";
import { User } from "#Application/Aggregates/User/User.ts";
import { Comment } from "#Application/Aggregates/User/ValueObjects/Comment.ts";
import { Email } from "#Application/Aggregates/User/ValueObjects/Email.ts";
import { Name } from "#Application/Aggregates/User/ValueObjects/Name.ts";
import { Rating } from "#Application/Aggregates/User/ValueObjects/Rating.ts";
import { ReviewId } from "#Application/Aggregates/User/ValueObjects/ReviewId.ts";
import { UserId } from "#Application/Aggregates/User/ValueObjects/UserId.ts";
import type { UserRepository } from "#Application/Driven/UserRepository.ts";

import type { UserSnapshot } from "./UserSnapshot";

export class JsonUserRepository implements UserRepository {
  constructor(private readonly filepath: string) {}

  toSnapshot(user: User): UserSnapshot {
    return {
      version: user.version,
      userId: user.userId.uuid,
      name: user.name.fullName,
      email: user.email.email,

      trackedBooks: Array.from(user.trackedBooks.values()).map((tb) => ({
        isbn: tb.isbn.isbn,
        status: tb.status,
      })),

      reviews: Array.from(user.reviews.entries()).map(([isbn, review]) => ({
        isbn: review.isbn,
        reviewId: review.review.reviewId.id,
        rating: review.review.rating.rating,
        comment: review.review.comment.comment,
      })),
    };
  }

  private async loadAll(): Promise<UserSnapshot[]> {
    const file = Bun.file(this.filepath);

    if (!(await file.exists())) {
      return [];
    }

    const content = await file.text();
    return JSON.parse(content);
  }

  async findById(id: UserId): Promise<User | null> {
    const users = await this.loadAll();
    const persistedUser = users.find((u) => u.userId === id.uuid);
    const reviews = new Map(
      persistedUser?.reviews.map((r) => [
        r.isbn,
        Review.create(
          ReviewId.fromPersistence(r.reviewId),
          Rating.fromPersistence(r.rating),
          Comment.fromPersistence(r.comment),
        ),
      ]),
    );
    const trackedBooks = new Map(
      persistedUser?.trackedBooks.map((tb) => [
        tb.isbn,
        TrackedBook.create(ISBN.fromPersistence(tb.isbn), tb.status),
      ]),
    );

    return persistedUser
      ? User.rehydrate(
          persistedUser.version,
          UserId.parse(persistedUser.userId),
          Name.parse(persistedUser.name),
          Email.parse(persistedUser.email),
          trackedBooks,
          reviews,
        )
      : null;
  }

  async save(user: User): Promise<void> {
    const usersSnapshots = await this.loadAll();
    const snapshot = this.toSnapshot(user) satisfies UserSnapshot;

    const existingSnapshotIndex = usersSnapshots.findIndex((u) => u.userId === snapshot.userId);

    if (existingSnapshotIndex >= 0) {
      const existing = usersSnapshots[existingSnapshotIndex];
      if (existing?.version !== user.version) {
        throw new Error("Concurrency conflict: User was modified");
      }
      const nextSnapshot: UserSnapshot = {
        ...this.toSnapshot(user),
        version: user.version + 1,
      };

      usersSnapshots[existingSnapshotIndex] = nextSnapshot;
    } else {
      const newSnapshot: UserSnapshot = {
        ...this.toSnapshot(user),
        version: 1,
      };
      usersSnapshots.push(newSnapshot);
    }

    const result = await Bun.write(this.filepath, JSON.stringify(usersSnapshots, null, 2));

    if (typeof result !== "number") {
      throw new Error("FAiled to persist User aggergate");
    }

    user.bumpVersion();
  }
}
