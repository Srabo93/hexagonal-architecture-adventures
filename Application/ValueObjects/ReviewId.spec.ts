import { describe, expect, it } from "bun:test";

import { ReviewId } from "./ReviewId.ts";

describe("ReviewId Value Object", () => {
  it("should create a valid review ID", () => {
    const validId = crypto.randomUUID();
    const reviewId = ReviewId.parse(validId);
    expect(reviewId.id).toBe(validId);
  });

  it("should create review ID with different valid UUIDs", () => {
    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();

    const reviewId1 = ReviewId.parse(id1);
    const reviewId2 = ReviewId.parse(id2);

    expect(reviewId1.id).toBe(id1);
    expect(reviewId2.id).toBe(id2);
    expect(reviewId1.id).not.toBe(reviewId2.id);
  });

  it("should handle UUID version 4 format", () => {
    const v4Uuid = "550e8400-e29b-41d4-a716-446655440000";
    const reviewId = ReviewId.parse(v4Uuid);
    expect(reviewId.id).toBe(v4Uuid);
  });
});

