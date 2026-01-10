import type { Book } from "#Application/Aggregates/Book.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";

export interface BookRepository {
  findByISBN(isbn: ISBN): Promise<Book | null>;
  save(book: Book): Promise<boolean | Error>;
}
