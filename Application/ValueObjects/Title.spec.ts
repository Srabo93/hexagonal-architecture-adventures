import { describe, expect, it } from "bun:test";

import { Title } from "./Title.ts";

describe("Title Value Object", () => {
  it("should create a valid short title", () => {
    const title = Title.parse("Dune");
    expect(title.title).toBe("Dune");
  });

  it("should create a title with spaces", () => {
    const title = Title.parse("The Great Gatsby");
    expect(title.title).toBe("The Great Gatsby");
  });

  it("should create a title with numbers", () => {
    const title = Title.parse("1984");
    expect(title.title).toBe("1984");
  });

  it("should create a title with punctuation", () => {
    const title = Title.parse("The Hitchhiker's Guide to the Galaxy!");
    expect(title.title).toBe("The Hitchhiker's Guide to the Galaxy!");
  });

  it("should create a title at maximum length", () => {
    const longTitle = "a".repeat(200);
    const title = Title.parse(longTitle);
    expect(title.title).toBe(longTitle);
  });

  it("should throw error for empty title", () => {
    expect(() => Title.parse("")).toThrow("title cannot be empty");
  });

  it("should throw error for title with only whitespace", () => {
    expect(() => Title.parse("   ")).toThrow("title cannot be empty");
  });

  it("should throw error for title that exceeds maximum length", () => {
    const tooLongTitle = "a".repeat(201);
    expect(() => Title.parse(tooLongTitle)).toThrow("title is too long");
  });

  it("should trim whitespace from title", () => {
    const title = Title.parse("  The Great Gatsby  ");
    expect(title.title).toBe("The Great Gatsby");
  });

  it("should handle titles with special characters", () => {
    const title = Title.parse("C++ Programming: A Modern Approach");
    expect(title.title).toBe("C++ Programming: A Modern Approach");
  });

  it("should handle titles with colons and dashes", () => {
    const title = Title.parse("Clean Code: A Handbook of Agile Software Craftsmanship");
    expect(title.title).toBe("Clean Code: A Handbook of Agile Software Craftsmanship");
  });
});

