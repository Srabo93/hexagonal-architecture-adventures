import type { BookRepository } from "#Application/Driven/BookRepository.ts";
import type { BookUseCases } from "#Application/Driving/BookUseCases.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { inject, injectable } from "tsyringe";
import type { BookDTO } from "./BookDTO";
import { StockAmount } from "#Application/ValueObjects/StockAmount.ts";
import { Title } from "#Application/ValueObjects/Title.ts";

@injectable()
export class CLIBookAdapter implements BookUseCases {
  constructor(
    @inject("bookRepository") private readonly bookRepository: BookRepository,
  ) {}

  async purchaseBook(isbn: string, amount: number): Promise<boolean> {
    const book = await this.bookRepository.findByISBN(ISBN.parse(isbn));

    if (book === null) {
      return false;
    }

    book.purchaseBook(StockAmount.parse(amount));

    const result = await this.bookRepository.save(book);

    if (result instanceof Error) {
      throw result;
    }

    return result;
  }

  async returnBook(isbn: string, amount: number): Promise<boolean> {
    const book = await this.bookRepository.findByISBN(ISBN.parse(isbn));

    if (book === null) {
      return false;
    }

    book.returnBook(StockAmount.parse(amount));

    const result = await this.bookRepository.save(book);

    if (result instanceof Error) {
      throw result;
    }

    return result;
  }

  async changeBookTitle(isbn: string, newTitle: string): Promise<void | Error> {
    const book = await this.bookRepository.findByISBN(ISBN.parse(isbn));

    if (book === null) {
      throw new Error("No book found");
    }

    book.changeBookTitle(Title.parse(newTitle));

    const result = await this.bookRepository.save(book);

    if (result instanceof Error) {
      throw result;
    }
  }

  async publish(isbn: string): Promise<void> {
    const book = await this.bookRepository.findByISBN(ISBN.parse(isbn));

    if (book === null) {
      throw new Error("No book found");
    }

    book.publish("Published");

    const result = await this.bookRepository.save(book);

    if (result instanceof Error) {
      throw result;
    }
  }

  async unpublish(isbn: string): Promise<void> {
    const book = await this.bookRepository.findByISBN(ISBN.parse(isbn));

    if (book === null) {
      throw new Error("No book found");
    }

    book.unpublish("Unpublished");

    const result = await this.bookRepository.save(book);

    if (result instanceof Error) {
      throw result;
    }
  }

  async getBook(isbn: string): Promise<BookDTO | null> {
    const book = await this.bookRepository.findByISBN(ISBN.parse(isbn));

    if (book === null) {
      return null;
    }

    return {
      title: book.title.title,
      isbn: book.isbn.isbn,
      published: book.published,
      stock: {
        amount: book.stock.amount.value,
        availability: book.stock.availability,
      },
      author: {
        name: book.author.name.fullName(),
        authorId: book.author.authorId.uuid,
      },
    } satisfies BookDTO;
  }
}
