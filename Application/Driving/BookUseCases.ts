import type { BookDTO } from "#Adapters/Driving/BookDTO.ts";

export interface BookUseCases {
  purchaseBook(isbn: string, amount: number): Promise<boolean>;
  returnBook(isbn: string, amount: number): Promise<boolean>;
  changeBookTitle(isbn: string, newTitle: string): Promise<void | Error>;
  publish(isbn: string): Promise<void>;
  unpublish(isbn: string): Promise<void>;
  getBook(isbn: string): Promise<BookDTO | null>;
}
