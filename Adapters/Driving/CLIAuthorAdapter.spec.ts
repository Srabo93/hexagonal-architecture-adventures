import { UserId } from "#Application/ValueObjects/UserId.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { cliAuthorAdapter } from "../../configurator.ts";
import { Book } from "#Application/Entities/Book.ts";
import { Author } from "#Application/Aggregates/Author.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";
import { Title } from "#Application/ValueObjects/Title.ts";
import { JsonAuthorRepository } from "#Adapters/Driven/JsonAuthorRepository.ts";

const TEST_BOOKS_FILE = "./DB/Disk/books.json";
const TEST_AUTHORS_FILE = "./DB/Disk/authors.json";

describe("CLIAuthorAdapter (integration)", () => {
  let authorId: string;
  let isbn: string;
  let authorRepo: JsonAuthorRepository;

  beforeEach(async () => {
    try {
      await Bun.write(TEST_BOOKS_FILE, JSON.stringify([]));
      await Bun.write(TEST_AUTHORS_FILE, JSON.stringify([]));

      authorId = UserId.parse(crypto.randomUUID()).uuid;
      isbn = "9781234567890";

      authorRepo = new JsonAuthorRepository(TEST_AUTHORS_FILE, TEST_BOOKS_FILE);

      // Create an author
      const author = Author.create(
        UserId.parse(authorId),
        Name.parse("Test Author"),
        [],
      );
      await authorRepo.save(author);

      // Create a book
      const book = Book.create(
        { authorId: author.authorId, name: author.name },
        PublishStatus.unpublished,
        ISBN.parse(isbn),
        Title.parse("Test Book"),
      );
      await authorRepo.saveBook(book);
    } catch {}
  });

  afterEach(async () => {
    try {
      await Bun.write(TEST_BOOKS_FILE, JSON.stringify([]));
      await Bun.write(TEST_AUTHORS_FILE, JSON.stringify([]));
    } catch {}
  });

  it("should publish a book", async () => {
    await cliAuthorAdapter.publishBook(authorId, isbn);

    const book = await cliAuthorAdapter.getBook(isbn);
    expect(book).toBeDefined();
    expect(book?.published).toBe(PublishStatus.published);
  });

  it("should unpublish a book", async () => {
    // First publish
    await cliAuthorAdapter.publishBook(authorId, isbn);
    let book = await cliAuthorAdapter.getBook(isbn);
    expect(book?.published).toBe(PublishStatus.published);

    // Then unpublish
    await cliAuthorAdapter.unpublishBook(authorId, isbn);
    book = await cliAuthorAdapter.getBook(isbn);
    expect(book?.published).toBe(PublishStatus.unpublished);
  });

  it("should throw error when author tries to publish someone else's book", async () => {
    // Create another author
    const otherAuthorId = UserId.parse(crypto.randomUUID()).uuid;
    const otherAuthor = Author.create(
      UserId.parse(otherAuthorId),
      Name.parse("Other Author"),
      [],
    );
    await authorRepo.save(otherAuthor);

    // Try to publish with wrong author
    await expect(
      cliAuthorAdapter.publishBook(otherAuthorId, isbn),
    ).rejects.toThrow("Author can only publish their own books");
  });
});
