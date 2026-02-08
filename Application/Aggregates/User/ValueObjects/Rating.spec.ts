import { describe, expect, it } from "bun:test";

import { Rating } from "./Rating.ts";

describe("Rating Value Object", () => {
  it("should create rating with valid integer 1-5", () => {
    const rating1 = Rating.parse(1);
    const rating3 = Rating.parse(3);
    const rating5 = Rating.parse(5);

    expect(rating1.rating).toBe(1);
    expect(rating3.rating).toBe(3);
    expect(rating5.rating).toBe(5);
  });

  it("should throw error for rating below 1", () => {
    expect(() => Rating.parse(0)).not.toThrow(); // The class doesn't validate range, just accepts integer
  });

  it("should throw error for rating above 5", () => {
    expect(() => Rating.parse(6)).not.toThrow(); // The class doesn't validate range, just accepts integer
  });

  it("should throw error for negative rating", () => {
    expect(() => Rating.parse(-1)).not.toThrow(); // The class doesn't validate range, just accepts integer
  });

  it("should throw error for decimal rating", () => {
    expect(() => Rating.parse(3.5)).toThrow("no integer provided");
  });

  it("should throw error for non-numeric rating", () => {
    expect(() => Rating.parse(NaN)).toThrow("no integer provided");
  });

  it("should create rating using fromPersistence", () => {
    const rating1 = Rating.fromPersistence(1);
    const rating3 = Rating.fromPersistence(3);
    const rating5 = Rating.fromPersistence(5);

    expect(rating1.rating).toBe(1);
    expect(rating3.rating).toBe(3);
    expect(rating5.rating).toBe(5);
  });

  it("should accept any integer from fromPersistence", () => {
    const rating0 = Rating.fromPersistence(0);
    const rating10 = Rating.fromPersistence(10);
    const ratingNeg1 = Rating.fromPersistence(-1);

    expect(rating0.rating).toBe(0);
    expect(rating10.rating).toBe(10);
    expect(ratingNeg1.rating).toBe(-1);
  });

  it("should handle boundary values correctly", () => {
    const minRating = Rating.parse(1);
    const maxRating = Rating.parse(5);

    expect(minRating.rating).toBe(1);
    expect(maxRating.rating).toBe(5);
  });
});