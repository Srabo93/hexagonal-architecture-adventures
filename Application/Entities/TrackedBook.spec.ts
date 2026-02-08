import { describe, expect, it } from "bun:test";

import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";

import { TrackedBook } from "./TrackedBook.ts";

describe("TrackedBook Entity", () => {
  const isbn = ISBN.parse("9781234567890");

  it("should create a tracked book with isbn and status", () => {
    const trackedBook = TrackedBook.create(isbn, ReadingStatus.reading);

    expect(trackedBook.isbn).toBe(isbn);
    expect(trackedBook.status).toBe(ReadingStatus.reading);
  });

  it("should rehydrate a tracked book with existing data", () => {
    const trackedBook = TrackedBook.rehydrate(isbn, ReadingStatus.read);

    expect(trackedBook.isbn).toBe(isbn);
    expect(trackedBook.status).toBe(ReadingStatus.read);
  });

  it("should allow updating status", () => {
    const trackedBook = TrackedBook.create(isbn, ReadingStatus.wantToRead);

    expect(trackedBook.status).toBe(ReadingStatus.wantToRead);

    trackedBook.updateStatus(ReadingStatus.reading);
    expect(trackedBook.status).toBe(ReadingStatus.reading);

    trackedBook.updateStatus(ReadingStatus.read);
    expect(trackedBook.status).toBe(ReadingStatus.read);
  });
});

