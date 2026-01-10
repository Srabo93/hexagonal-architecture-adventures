import { Book } from "#Application/Aggregates/Book.ts";
import type { BookRepository } from "#Application/Driven/BookRepository.ts";
import { Stock } from "#Application/Entities/Stock.ts";
import { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { Name } from "#Application/ValueObjects/Name.ts";
import { StockAmount } from "#Application/ValueObjects/StockAmount.ts";
import { Title } from "#Application/ValueObjects/Title.ts";
import { UserId } from "#Application/ValueObjects/UserId.ts";
import type { BookSnapshot } from "./BookSnapshot";
import { injectable } from "tsyringe";

@injectable()
export class JsonBookRepository implements BookRepository {
  constructor(private readonly filepath: string) {}

  toSnapshot(book: Book): BookSnapshot {
    return {
      isbn: book.isbn.isbn,
      title: book.title.title,
      published: book.published,
      stock: {
        amount: book.stock.amount.value,
        availability: book.stock.availability,
      },
      author: {
        name: book.author.name.fullName(),
        authorId: book.author.authorId.uuid,
      },
    };
  }

  private async loadAll(): Promise<BookSnapshot[]> {
    const file = Bun.file(this.filepath);

    if (!(await file.exists())) {
      return [];
    }

    const content = await file.text();
    return JSON.parse(content);
  }

  async findByISBN(isbn: ISBN): Promise<Book | null> {
    const books = await this.loadAll();
    const persistedBook = books.find((book) => book.isbn === isbn.isbn);

    return persistedBook
      ? Book.rehydrate(
          {
            authorId: UserId.parse(persistedBook.author.authorId),
            name: Name.parse(persistedBook.author.name),
          },
          Stock.create(
            StockAmount.parse(persistedBook.stock.amount),
            persistedBook.stock.availability,
          ),
          persistedBook.published,
          ISBN.parse(persistedBook.isbn),
          Title.parse(persistedBook.title),
        )
      : null;
  }

  async save(book: Book): Promise<boolean | Error> {
    const books = await this.loadAll();
    const snapshot = this.toSnapshot(book) satisfies BookSnapshot;

    const index = books.findIndex((book) => book.isbn === snapshot.isbn);

    if (index >= 0) {
      books[index] = snapshot;
    } else {
      books.push(snapshot);
    }

    try {
      const isSuccessfull = await Bun.write(
        this.filepath,
        JSON.stringify(books, null, 2),
      );

      if (!(typeof isSuccessfull === "number")) {
        throw new Error("Something went wrong to persist the aggregate User");
      }
    } catch (error) {
      throw error;
    }
    return true;
  }
}
