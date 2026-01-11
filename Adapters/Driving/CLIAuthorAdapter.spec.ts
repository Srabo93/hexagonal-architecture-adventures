import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { container } from "tsyringe";

import { Author } from "#Application/Aggregates/Author.ts";
import { Book } from "#Application/Entities/Book.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";
import { Title } from "#Application/ValueObjects/Title.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";

import { JsonAuthorRepository } from "#Adapters/Driven/JsonAuthorRepository.ts";

import { CLIAuthorAdapter } from "./CLIAuthorAdapter.ts";

const TEST_AUTHORS_FILE = "./DB/Disk/authorstest.json";

describe("CLIAuthorAdapter (integration)", () => {
  let authorId: string;
  let isbn: string;
  let authorRepo: JsonAuthorRepository;
  let cliAuthorAdapter: CLIAuthorAdapter;

  beforeEach(async () => {
    container.clearInstances();

    await Bun.write(TEST_AUTHORS_FILE, JSON.stringify([]));

    authorRepo = new JsonAuthorRepository(TEST_AUTHORS_FILE);

    container.register("AuthorRepository", {
      useValue: authorRepo,
    });

    cliAuthorAdapter = container.resolve(CLIAuthorAdapter);

    authorId = UserId.parse(crypto.randomUUID()).uuid;
    isbn = "9781234567890";

    const author = Author.create(
      UserId.parse(authorId),
      Name.parse("Test Author"),
      new Map().set(
        isbn,
        Book.create(
          {
            authorId: UserId.parse(authorId),
            name: Name.parse("Test Author"),
          },
          PublishStatus.unpublished,
          ISBN.parse(isbn),
          Title.parse("Test Book"),
        ),
      ),
    );

    await authorRepo.save(author);
  });

  afterEach(async () => {
    await Bun.write(TEST_AUTHORS_FILE, JSON.stringify([]));
  });

  it("should publish a book", async () => {
    await cliAuthorAdapter.publishBook(authorId, isbn);

    const author = await authorRepo.findById(UserId.parse(authorId));
    const book = author?.publishedBooks.get(isbn);
    expect(book).toBeDefined();
    expect(book?.published).toBe(PublishStatus.published);
  });

  it("should unpublish a book", async () => {
    // First publish
    await cliAuthorAdapter.publishBook(authorId, isbn);
    let author = await authorRepo.findById(UserId.parse(authorId));
    let book = author?.publishedBooks.get(isbn);
    expect(book?.published).toBe(PublishStatus.published);

    // Then unpublish
    await cliAuthorAdapter.unpublishBook(authorId, isbn);
    author = await authorRepo.findById(UserId.parse(authorId));
    book = author?.publishedBooks.get(isbn);
    expect(book?.published).toBe(PublishStatus.unpublished);
  });

  it("should throw if author tries to publish a book they do not own", async () => {
    const otherAuthorId = UserId.parse(crypto.randomUUID()).uuid;

    const otherAuthor = Author.create(
      UserId.parse(otherAuthorId),
      Name.parse("Other Author"),
      new Map(), // no books
    );

    await authorRepo.save(otherAuthor);

    expect(cliAuthorAdapter.publishBook(otherAuthorId, isbn)).rejects.toThrow("Book not found");
  });
});
