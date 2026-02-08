import { describe, expect, it } from "bun:test";

import { Review } from "#Application/Entities/Review.ts";
import { TrackedBook } from "#Application/Entities/TrackedBook.ts";
import { Comment } from "#Application/ValueObjects/Comment.ts";
import { Email } from "#Application/ValueObjects/Email.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { Rating } from "#Application/ValueObjects/Rating.ts";
import { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";
import { ReviewId } from "#Application/ValueObjects/ReviewId.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";

import { User } from "./User.ts";

describe("User Aggregate", () => {
  const userId = UserId.parse(crypto.randomUUID());
  const name = Name.parse("John Doe");
  const email = Email.parse("john@example.com");
  const isbn = ISBN.parse("9781234567890");

  it("should create a user with empty tracked books and reviews", () => {
    const user = User.create(userId, name, email);

    expect(user.userId).toBe(userId);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.trackedBooks).toHaveLength(0);
    expect(user.reviews).toHaveLength(0);
    expect(user.version).toBe(0);
  });

  it("should rehydrate a user with existing data", () => {
    const trackedBooks = new Map([[isbn.isbn, TrackedBook.create(isbn, ReadingStatus.read)]]);

    const review = Review.create(
      ReviewId.parse(crypto.randomUUID()),
      Rating.parse(5),
      Comment.parse("Great book!"),
    );

    const reviews = new Map([[isbn.isbn, review]]);

    const user = User.rehydrate(1, userId, name, email, trackedBooks, reviews);

    expect(user.version).toBe(1);
    expect(user.userId).toBe(userId);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.trackedBooks).toHaveLength(1);
    expect(user.reviews).toHaveLength(1);
  });

  it("should track a book successfully", () => {
    const user = User.create(userId, name, email);

    const trackedBook = user.trackBook(isbn, ReadingStatus.reading);

    expect(trackedBook.isbn).toBe(isbn);
    expect(trackedBook.status).toBe(ReadingStatus.reading);
    expect(user.trackedBooks).toHaveLength(1);
    expect(user.trackedBooks[0]).toBe(trackedBook);
  });

  it("should throw when trying to track the same book twice", () => {
    const user = User.create(userId, name, email);

    user.trackBook(isbn, ReadingStatus.reading);

    expect(() => user.trackBook(isbn, ReadingStatus.read)).toThrow("book already tracked");
  });

  it("should write a review when book is tracked and read", () => {
    const user = User.create(userId, name, email);

    user.trackBook(isbn, ReadingStatus.read);

    const review = Review.create(
      ReviewId.parse(crypto.randomUUID()),
      Rating.parse(4),
      Comment.parse("Good book!"),
    );

    const writtenReview = user.writeReview(isbn, review);

    expect(writtenReview).toBe(review);
    expect(user.reviews).toHaveLength(1);
    expect(user.reviews[0]?.isbn).toBe(isbn.isbn);
    expect(user.reviews[0]?.review).toBe(review);
  });

  it("should throw when trying to review a non-tracked book", () => {
    const user = User.create(userId, name, email);

    const review = Review.create(
      ReviewId.parse(crypto.randomUUID()),
      Rating.parse(5),
      Comment.parse("Great book!"),
    );

    expect(() => user.writeReview(isbn, review)).toThrow("book is not tracked");
  });

  it("should throw when trying to review a book that is not read", () => {
    const user = User.create(userId, name, email);

    user.trackBook(isbn, ReadingStatus.reading);

    const review = Review.create(
      ReviewId.parse(crypto.randomUUID()),
      Rating.parse(5),
      Comment.parse("Great book!"),
    );

    expect(() => user.writeReview(isbn, review)).toThrow("book has to be read before reviewed");
  });

  it("should untrack a book successfully", () => {
    const user = User.create(userId, name, email);

    user.trackBook(isbn, ReadingStatus.wantToRead);
    expect(user.trackedBooks).toHaveLength(1);

    user.untrackBook(isbn);
    expect(user.trackedBooks).toHaveLength(0);
  });

  it("should throw when trying to untrack a non-tracked book", () => {
    const user = User.create(userId, name, email);

    expect(() => user.untrackBook(isbn)).toThrow("book is not tracked");
  });

  it("should bump version when requested", () => {
    const user = User.create(userId, name, email);

    expect(user.version).toBe(0);

    user.bumpVersion();

    expect(user.version).toBe(1);
  });

  it("should allow updating name", () => {
    const user = User.create(userId, name, email);
    const newName = Name.parse("Jane Smith");

    user.name = newName;

    expect(user.name).toBe(newName);
  });

  it("should return reviews as readonly array with isbn and review", () => {
    const user = User.create(userId, name, email);

    user.trackBook(isbn, ReadingStatus.read);

    const review = Review.create(
      ReviewId.parse(crypto.randomUUID()),
      Rating.parse(3),
      Comment.parse("Okay book"),
    );

    user.writeReview(isbn, review);

    const reviews = user.reviews;
    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toEqual({
      isbn: isbn.isbn,
      review: review,
    });
  });
});

