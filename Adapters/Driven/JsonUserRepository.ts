import { User } from "#Application/Aggregates/User.ts";
import type { UserRepository } from "#Application/Driven/UserRepository.ts";
import { Review } from "#Application/Entities/Review.ts";
import { TrackedBook } from "#Application/Entities/TrackedBook.ts";
import { Comment } from "#Application/ValueObjects/Comment.ts";
import { Email } from "#Application/ValueObjects/Email.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { Rating } from "#Application/ValueObjects/Rating.ts";
import { ReviewId } from "#Application/ValueObjects/ReviewId.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";
import type { UserSnapshot } from "./UserSnapshot";

export class JsonUserRepository implements UserRepository {
  constructor(private readonly filepath: string) {}

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
        ISBN.parse(r.isbn).isbn,
        new Review(
          ReviewId.parse(r.reviewId),
          Rating.parseInteger(r.rating),
          Comment.parse(r.comment),
        ),
      ]),
    );
    const trackedBooks = new Map(
      persistedUser?.trackedBooks.map((tb) => [
        ISBN.parse(tb.isbn).isbn,
        new TrackedBook(ISBN.parse(tb.isbn), tb.status),
      ]),
    );

    return persistedUser
      ? User.rehydrate(
          UserId.parse(persistedUser.userId),
          Name.parse(persistedUser.name),
          Email.parse(persistedUser.email),
          trackedBooks,
          reviews,
        )
      : null;
  }

  async save(user: User): Promise<boolean | Error> {
    const users = await this.loadAll();
    const snapshot = user.toSnapshot() satisfies UserSnapshot;

    const index = users.findIndex((u) => u.userId === snapshot.userId);

    if (index >= 0) {
      users[index] = snapshot;
    } else {
      users.push(snapshot);
    }

    try {
      const isSuccessfull = await Bun.write(
        this.filepath,
        JSON.stringify(users, null, 2),
      );

      if (!(typeof isSuccessfull === "number")) {
        throw new Error("Something went wrong to persist the aggregate User");
      }
    } catch (error) {
      throw error;
    }
    return true;
  }
}
