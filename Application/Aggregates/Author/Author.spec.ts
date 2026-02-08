import { describe, expect, it } from "bun:test";

import { Book } from "./Entities/Book.js";
import { ISBN } from "../Shared/ValueObjects/ISBN.js";
import { Name } from "../User/ValueObjects/Name.js";
import { PublishStatus } from "../Shared/ValueObjects/PublishStatus.js";
import { Title } from "./ValueObjects/Title.js";
import { UserId } from "../User/ValueObjects/UserId.js";

import { Author } from "./Author.ts";

describe("Author Aggregate", () => {
  const authorId = UserId.parse(crypto.randomUUID());
  const name = Name.parse("John Doe");
  const isbn = ISBN.parse("9781234567890");
  const title = Title.parse("Test Book");

  it("should create an author with empty published books", () => {
    const author = Author.create(authorId, name, new Map());

    expect(author.authorId).toBe(authorId);
    expect(author.name).toBe(name);
    expect(author.publishedBooks.size).toBe(0);
    expect(author.version).toBe(0);
  });

  it("should rehydrate an author with existing data", () => {
    const books = new Map([
      [isbn.isbn, Book.create({ authorId, name }, PublishStatus.published, isbn, title)],
    ]);

    const author = Author.rehydrate(1, authorId, name, books);

    expect(author.version).toBe(1);
    expect(author.authorId).toBe(authorId);
    expect(author.name).toBe(name);
    expect(author.publishedBooks.size).toBe(1);
  });

  it("should allow publishing a book that exists", () => {
    const books = new Map([
      [isbn.isbn, Book.create({ authorId, name }, PublishStatus.unpublished, isbn, title)],
    ]);

    const author = Author.create(authorId, name, books);
    expect(author.publishedBooks.get(isbn.isbn)?.published).toBe(PublishStatus.unpublished);

    author.publishBook(isbn);

    expect(author.publishedBooks.get(isbn.isbn)?.published).toBe(PublishStatus.published);
  });

  it("should throw when trying to publish a non-existent book", () => {
    const author = Author.create(authorId, name, new Map());

    expect(() => author.publishBook(isbn)).toThrow("Book not found");
  });

  it("should throw when trying to publish a book that belongs to another author", () => {
    const otherAuthorId = UserId.parse(crypto.randomUUID());
    const otherName = Name.parse("Other Author");

    const book = Book.create(
      { authorId: otherAuthorId, name: otherName },
      PublishStatus.unpublished,
      isbn,
      title,
    );

    const books = new Map([[isbn.isbn, book]]);
    const author = Author.create(authorId, name, books);

    expect(() => author.publishBook(isbn)).toThrow("Author can only publish their own books");
  });

  it("should allow unpublishing a book", () => {
    const books = new Map([
      [isbn.isbn, Book.create({ authorId, name }, PublishStatus.published, isbn, title)],
    ]);

    const author = Author.create(authorId, name, books);
    expect(author.publishedBooks.get(isbn.isbn)?.published).toBe(PublishStatus.published);

    author.unpublishBook(isbn);

    expect(author.publishedBooks.get(isbn.isbn)?.published).toBe(PublishStatus.unpublished);
  });

  it("should throw when trying to unpublish a non-existent book", () => {
    const author = Author.create(authorId, name, new Map());

    expect(() => author.unpublishBook(isbn)).toThrow("Book not found");
  });

  it("should throw when trying to unpublish a book that belongs to another author", () => {
    const otherAuthorId = UserId.parse(crypto.randomUUID());
    const otherName = Name.parse("Other Author");

    const book = Book.create(
      { authorId: otherAuthorId, name: otherName },
      PublishStatus.published,
      isbn,
      title,
    );

    const books = new Map([[isbn.isbn, book]]);
    const author = Author.create(authorId, name, books);

    expect(() => author.unpublishBook(isbn)).toThrow("Author can only unpublish their own books");
  });

  it("should bump version when requested", () => {
    const author = Author.create(authorId, name, new Map());

    expect(author.version).toBe(0);

    author.bumpVersion();

    expect(author.version).toBe(1);
  });

  it("should allow updating name", () => {
    const author = Author.create(authorId, name, new Map());
    const newName = Name.parse("Jane Smith");

    author.name = newName;

    expect(author.name).toBe(newName);
  });
});

