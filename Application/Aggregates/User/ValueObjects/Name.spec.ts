import { describe, expect, it } from "bun:test";

import { Name } from "./Name.ts";

describe("Name Value Object", () => {
  it("should create a valid two-part name", () => {
    const name = Name.parse("John Doe");
    expect(name.firstName).toBe("John");
    expect(name.lastName).toBe("Doe");
    expect(name.fullName).toBe("John Doe");
  });

  it("should handle names with hyphens", () => {
    const name = Name.parse("Mary-Jane Smith");
    expect(name.firstName).toBe("Mary-Jane");
    expect(name.lastName).toBe("Smith");
  });

  it("should handle names with apostrophes", () => {
    const name = Name.parse("O'Connor William");
    expect(name.firstName).toBe("O'Connor");
    expect(name.lastName).toBe("William");
  });

  it("should throw error for single name", () => {
    expect(() => Name.parse("John")).toThrow("Name must contain at least first and last name");
  });

  it("should throw error for empty name", () => {
    expect(() => Name.parse("")).toThrow("Name must contain at least first and last name");
  });

  it("should throw error for name with only whitespace", () => {
    expect(() => Name.parse("   ")).toThrow("Name must contain at least first and last name");
  });

  it("should throw error for name with only first name and whitespace", () => {
    expect(() => Name.parse("John   ")).toThrow("Name must contain at least first and last name");
  });

  it("should trim whitespace from name", () => {
    const name = Name.parse("  John Doe  ");
    expect(name.firstName).toBe("John");
    expect(name.lastName).toBe("Doe");
    expect(name.fullName).toBe("John Doe");
  });

  it("should handle multiple spaces between names", () => {
    const name = Name.parse("John    Doe");
    expect(name.firstName).toBe("John");
    expect(name.lastName).toBe("Doe");
    expect(name.fullName).toBe("John Doe");
  });
});

