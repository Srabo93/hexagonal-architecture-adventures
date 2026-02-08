import { describe, expect, it } from "bun:test";

import { StockAmount } from "./StockAmount.ts";

describe("StockAmount Value Object", () => {
  it("should create a valid positive stock amount", () => {
    const amount = StockAmount.parse(10);
    expect(amount.value).toBe(10);
  });

  it("should create zero stock amount", () => {
    const amount = StockAmount.parse(0);
    expect(amount.value).toBe(0);
  });

  it("should create large stock amount", () => {
    const amount = StockAmount.parse(1000000);
    expect(amount.value).toBe(1000000);
  });

  it("should throw error for negative stock amount", () => {
    expect(() => StockAmount.parse(-1)).toThrow("number cant be negative");
  });

  it("should throw error for large negative stock amount", () => {
    expect(() => StockAmount.parse(-100)).toThrow("number cant be negative");
  });

  it("should throw error for decimal stock amount", () => {
    expect(() => StockAmount.parse(3.5)).toThrow("provided number is not an integer");
  });

  it("should throw error for non-integer stock amount", () => {
    expect(() => StockAmount.parse(10.7)).toThrow("provided number is not an integer");
  });

  it("should handle NaN", () => {
    expect(() => StockAmount.parse(NaN)).toThrow("provided number is not an integer");
  });

  it("should handle boundary values", () => {
    const zeroAmount = StockAmount.parse(0);
    const oneAmount = StockAmount.parse(1);
    
    expect(zeroAmount.value).toBe(0);
    expect(oneAmount.value).toBe(1);
  });
});