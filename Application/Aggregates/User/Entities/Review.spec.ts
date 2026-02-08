import { describe, expect, it } from "bun:test";

import { Comment } from "../ValueObjects/Comment.js";
import { Rating } from "../ValueObjects/Rating.js";
import { ReviewId } from "../ValueObjects/ReviewId.js";

import { Review } from "./Review.ts";

describe("Review Entity", () => {
  const reviewId = ReviewId.parse(crypto.randomUUID());
  const rating = Rating.parse(4);
  const comment = Comment.parse("Great book!");

  it("should create a review with id, rating, and comment", () => {
    const review = Review.create(reviewId, rating, comment);

    expect(review.reviewId).toBe(reviewId);
    expect(review.rating).toBe(rating);
    expect(review.comment).toBe(comment);
  });

  it("should rehydrate a review with existing data", () => {
    const review = Review.rehydrate(reviewId, rating, comment);

    expect(review.reviewId).toBe(reviewId);
    expect(review.rating).toBe(rating);
    expect(review.comment).toBe(comment);
  });

  it("should create reviews with different ratings", () => {
    const oneStar = Rating.parse(1);
    const threeStar = Rating.parse(3);
    const fiveStar = Rating.parse(5);

    const review1 = Review.create(reviewId, oneStar, comment);
    const review2 = Review.create(reviewId, threeStar, comment);
    const review3 = Review.create(reviewId, fiveStar, comment);

    expect(review1.rating).toBe(oneStar);
    expect(review2.rating).toBe(threeStar);
    expect(review3.rating).toBe(fiveStar);
  });

  it("should create reviews with different comments", () => {
    const badComment = Comment.parse("Terrible book!");
    const goodComment = Comment.parse("Amazing book!");
    const neutralComment = Comment.parse("It was okay.");

    const review1 = Review.create(reviewId, rating, badComment);
    const review2 = Review.create(reviewId, rating, goodComment);
    const review3 = Review.create(reviewId, rating, neutralComment);

    expect(review1.comment).toBe(badComment);
    expect(review2.comment).toBe(goodComment);
    expect(review3.comment).toBe(neutralComment);
  });
});