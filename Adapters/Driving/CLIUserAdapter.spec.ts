import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { container } from "tsyringe";

import type { User } from "#Application/Aggregates/User.ts";
import { ReviewId } from "#Application/ValueObjects/ReviewId.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";

import { JsonUserRepository } from "#Adapters/Driven/JsonUserRepository.ts";

import { CLIUserAdapter } from "./CLIUserAdapter.ts";

const TEST_FILE_PATH = "./DB/Disk/userstest.json";

describe("CLIUserAdapter (integration)", () => {
  let isbn: string;
  let reviewId: ReviewId["id"];
  let user: User;
  let cliUserAdapter: CLIUserAdapter;
  let userRepo: JsonUserRepository;

  beforeEach(async () => {
    container.clearInstances();

    await Bun.write(TEST_FILE_PATH, JSON.stringify([]));

    userRepo = new JsonUserRepository(TEST_FILE_PATH);

    container.register("UserRepository", {
      useValue: userRepo,
    });

    cliUserAdapter = container.resolve(CLIUserAdapter);

    const userId = UserId.parse(crypto.randomUUID()).uuid;
    isbn = "9781234567890";
    reviewId = ReviewId.parse(crypto.randomUUID()).id;

    user = await cliUserAdapter.createUser(userId, "John Doe", "john@example.com");
  });

  afterEach(async () => {
    try {
      await Bun.write(TEST_FILE_PATH, JSON.stringify([]));
    } catch {}
  });

  it("should write a user review if book status is 'Read'", async () => {
    await cliUserAdapter.trackBook(user.userId.uuid, isbn, "Read");
    const trackedBooks = await cliUserAdapter.getTrackedBooks(user.userId.uuid);
    expect(trackedBooks.length).toBe(1);
    expect(trackedBooks[0]).toMatchObject({
      isbn,
      status: "Read",
    });

    const review = await cliUserAdapter.writeReview(user.userId.uuid, isbn, {
      reviewId,
      rating: 5,
      comment: "Amazing book!",
    });

    expect(review).toBeDefined();
    expect(review).toMatchObject({
      isbn,
      reviewId,
      rating: 5,
      comment: "Amazing book!",
    });
  });

  it("should fail writing a user review because book status is 'Reading'", async () => {
    await cliUserAdapter.trackBook(user.userId.uuid, isbn, "Reading");
    const trackedBooks = await cliUserAdapter.getTrackedBooks(user.userId.uuid);
    expect(trackedBooks.length).toBe(1);
    expect(trackedBooks[0]).toMatchObject({
      isbn,
      status: "Reading",
    });

    expect(
      cliUserAdapter.writeReview(user.userId.uuid, isbn, {
        reviewId,
        rating: 5,
        comment: "Amazing book!",
      }),
    ).rejects.toThrow("book has to be read before reviewed");

    const reviews = await cliUserAdapter.getReviews(user.userId.uuid);
    expect(reviews.length).toBe(0);
  });

  it("should fail writing a user review because book status is 'WantToRead'", async () => {
    await cliUserAdapter.trackBook(user.userId.uuid, isbn, "WantToRead");
    const trackedBooks = await cliUserAdapter.getTrackedBooks(user.userId.uuid);
    expect(trackedBooks.length).toBe(1);
    expect(trackedBooks[0]).toMatchObject({
      isbn,
      status: "WantToRead",
    });

    expect(
      cliUserAdapter.writeReview(user.userId.uuid, isbn, {
        reviewId,
        rating: 5,
        comment: "Amazing book!",
      }),
    ).rejects.toThrow("book has to be read before reviewed");

    const reviews = await cliUserAdapter.getReviews(user.userId.uuid);
    expect(reviews.length).toBe(0);
  });

  it("should track a users book when valid isbn provided", async () => {
    const trackedBook = await cliUserAdapter.trackBook(user.userId.uuid, isbn, "WantToRead");
    expect(trackedBook).toBeDefined();
    expect(trackedBook).toMatchObject({
      isbn,
      status: "WantToRead",
    });
  });

  //TODO: this will be the first UserService that incorporates Book Aggregate to check if a book is valid
  it.skip("should throw when a user tracks a book with invalid isbn", async () => {
    expect(
      await cliUserAdapter.trackBook(user.userId.uuid, "ThisWillThrow", "WantToRead"),
    ).rejects.toThrow();
  });
});
