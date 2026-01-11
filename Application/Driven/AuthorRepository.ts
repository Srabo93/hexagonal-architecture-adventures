import type { Author } from "#Application/Aggregates/Author.ts";
import type { Book } from "#Application/Entities/Book.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { UserId } from "#Application/ValueObjects/UserId.ts";

export interface AuthorRepository {
  findById(id: UserId): Promise<Author | null>;
  save(author: Author): Promise<boolean | Error>;
  // Book queries (books are entities within Author aggregate)
  findBookByISBN(isbn: ISBN): Promise<Book | null>;
  findAllBooks(): Promise<Book[]>;
  searchBooks(query: string): Promise<Book[]>;
  findBooksByAuthorId(authorId: string): Promise<Book[]>;
  saveBook(book: Book): Promise<boolean | Error>;
}
