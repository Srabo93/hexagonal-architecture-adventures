import { describe, expect, it } from "bun:test";

import { ISBN } from "./ISBN.ts";

describe("ISBN Value Object", () => {
  it("should create a valid ISBN-10", () => {
    const isbn = ISBN.parse("0123456789");
    expect(isbn.isbn).toBe("0123456789");
  });

  it("should create a valid ISBN-13", () => {
    const isbn = ISBN.parse("9780123456789");
    expect(isbn.isbn).toBe("9780123456789");
  });

  it("should create ISBN with dashes and remove them", () => {
    const isbn = ISBN.parse("978-0-123-45678-9");
    expect(isbn.isbn).toBe("9780123456789");
  });

  it("should create ISBN with spaces and remove them", () => {
    const isbn = ISBN.parse("978 0 123 45678 9");
    expect(isbn.isbn).toBe("9780123456789");
  });

  it("should create ISBN with mixed dashes and spaces", () => {
    const isbn = ISBN.parse("978-0 123-45678 9");
    expect(isbn.isbn).toBe("9780123456789");
  });

  it("should throw error for ISBN that is not provided", () => {
    expect(() => ISBN.parse("")).toThrow("isbn cannot be empty");
  });

  it("should throw error for ISBN that is too long", () => {
    expect(() =>
      ISBN.parse(
        "978012345678902030853053098050834504909430948058580409409430805094309409780123456789020308530530980508345049094309480585804094094308050943094097801234567890203085305309805083450490943094805858040940943080509430940",
      ),
    ).toThrow("isbn is too long");
  });
});

