import type { BookDTO } from "#Adapters/Driving/BookDTO.ts";

export interface AuthorUseCases {
  publishBook(authorId: string, isbn: string): Promise<void>;
  unpublishBook(authorId: string, isbn: string): Promise<void>;
  // Book queries (books are entities within Author aggregate)
  getBook(isbn: string): Promise<BookDTO | null>;
  searchBooks(query: string): Promise<BookDTO[]>;
  getBooksByAuthor(authorId: string): Promise<BookDTO[]>;
  listAllBooks(): Promise<BookDTO[]>;
}
