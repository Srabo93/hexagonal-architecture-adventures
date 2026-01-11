import { User } from "#Application/Aggregates/User.ts";
import { Comment } from "#Application/ValueObjects/Comment.ts";
import { Email } from "#Application/ValueObjects/Email.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { Rating } from "#Application/ValueObjects/Rating.ts";
import { ReviewId } from "#Application/ValueObjects/ReviewId.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { JsonUserRepository } from "./JsonUserRepository";
import { Review } from "#Application/Entities/Review.ts";

const TEST_FILE_PATH = "./DB/Disk/userstest.json";

describe("JsonUserRepository (integration)", () => {
  let repo: JsonUserRepository;

  beforeEach(async () => {
    repo = new JsonUserRepository(TEST_FILE_PATH);

    try {
      await Bun.write(TEST_FILE_PATH, JSON.stringify([]));
    } catch {}
  });

  afterEach(async () => {
    try {
      await Bun.write(TEST_FILE_PATH, JSON.stringify([]));
    } catch {}
  });

  it("persists and rehydrates a user", async () => {
    const userId = UserId.parse(crypto.randomUUID());
    const user = User.create(
      userId,
      Name.parse("John Doe"),
      Email.parse("john@doe.com"),
    );

    const isbn = ISBN.parse("9783161484100");
    const bookReview = Review.create(
      ReviewId.parse(crypto.randomUUID()),
      Rating.parseInteger(5),
      Comment.parse("Excellent book"),
    );

    user.trackBook(isbn, "Read");

    user.writeReview(isbn, bookReview);
    //Act
    const saveResult = await repo.save(user);
    expect(saveResult).toBe(true);

    const loadedUser = await repo.findById(userId);
    //Assert
    expect(loadedUser).not.toBeNull();

    if (!loadedUser) return;

    expect(loadedUser.userId.uuid).toBe(user.userId.uuid);
    expect(loadedUser.name.fullName()).toBe("John Doe");
    expect(loadedUser.email.email).toBe("john@doe.com");

    expect(loadedUser.trackedBooks.length).toBe(1);
    expect(loadedUser.reviews.length).toBe(1);

    const trackedBook = loadedUser.trackedBooks;
    expect(trackedBook[0]?.status).toBe("Read");

    const review = loadedUser.reviews;
    expect(review[0]?.review.rating.rating).toBe(5);
    expect(review[0]?.review.comment.comment).toBe("Excellent book");
  });

  it("returns null when user does not exist", async () => {
    const unknownUser = await repo.findById(UserId.parse(crypto.randomUUID()));
    expect(unknownUser).toBeNull();
  });

  it("updates an existing user instead of duplicating", async () => {
    const userId = UserId.parse(crypto.randomUUID());
    const user = User.create(
      userId,
      Name.parse("Jane Doe"),
      Email.parse("jane@doe.com"),
    );

    await repo.save(user);

    user.name = Name.parse("Jane Updated");
    await repo.save(user);

    const loaded = await repo.findById(userId);

    expect(loaded?.name.fullName()).toBe("Jane Updated");

    const file = await Bun.file(TEST_FILE_PATH).json();
    expect(file.length).toBe(1); // no duplicate users
  });
});
