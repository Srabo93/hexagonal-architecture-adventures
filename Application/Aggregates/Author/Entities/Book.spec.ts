import { ISBN } from "#Shared/ValueObjects/ISBN.ts";
import { PublishStatus } from "#Shared/ValueObjects/PublishStatus.ts";
import { describe, expect, it } from "bun:test";

import { Author } from "#Aggregates/Author/Author.ts";
import { Title } from "#Aggregates/Author/ValueObjects/Title.ts";
import { Name } from "#Aggregates/User/ValueObjects/Name.ts";
import { UserId } from "#Aggregates/User/ValueObjects/UserId.ts";

import { Book } from "./Book.ts";

describe("Book Entity", () => {
  const authorId = UserId.parse(crypto.randomUUID());
  const author = Author.create(authorId, Name.parse("Test Author"), new Map());
  const isbn = ISBN.parse("9781234567890");
  const title = Title.parse("Test Book");

  it("should create a book with all required fields", () => {
    const book = Book.create(
      { authorId: author.authorId, name: author.name },
      PublishStatus.unpublished,
      isbn,
      title,
    );

    expect(book.isbn).toBe(isbn);
    expect(book.title).toBe(title);
    expect(book.published).toBe(PublishStatus.unpublished);
    expect(book.author.authorId).toBe(author.authorId);
    expect(book.author.name).toBe(author.name);
  });

  it("should allow changing published status", () => {
    const book = Book.create(
      { authorId: author.authorId, name: author.name },
      PublishStatus.unpublished,
      isbn,
      title,
    );

    expect(book.published).toBe(PublishStatus.unpublished);
    book.published = PublishStatus.published;
    expect(book.published).toBe(PublishStatus.published);
  });
});
