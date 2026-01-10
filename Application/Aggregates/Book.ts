import type { Author } from "#Application/Entities/Author.ts";
import { Stock } from "#Application/Entities/Stock.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";
import { StockAmount } from "#Application/ValueObjects/StockAmount.ts";
import type { Title } from "#Application/ValueObjects/Title.ts";

export class Book {
  public get author(): Pick<Author, "authorId" | "name"> {
    return this._author;
  }
  public get stock(): Stock {
    return this._stock;
  }
  public get published(): PublishStatus {
    return this._published;
  }
  public set published(value: PublishStatus) {
    this._published = value;
  }
  public get title(): Title {
    return this._title;
  }
  public get isbn(): ISBN {
    return this._isbn;
  }

  private constructor(
    private _author: Pick<Author, "authorId" | "name">,
    private _stock: Stock,
    private _published: PublishStatus,
    private _isbn: ISBN,
    private _title: Title,
  ) {}

  static create(
    author: Pick<Author, "authorId" | "name">,
    stock: Stock,
    published: PublishStatus,
    isbn: ISBN,
    title: Title,
  ): Book {
    return new Book(author, stock, published, isbn, title);
  }

  static rehydrate(
    author: Pick<Author, "authorId" | "name">,
    stock: Stock,
    published: PublishStatus,
    isbn: ISBN,
    title: Title,
  ): Book {
    return new Book(author, stock, published, isbn, title);
  }

  public purchaseBook(amount: StockAmount) {
    return this.stock.subtractStock(amount);
  }

  public returnBook(amount: StockAmount) {
    return this.stock.addStock(amount);
  }

  public changeBookTitle(newTitle: Title) {
    this._title = newTitle;
  }

  public unpublish(status: typeof PublishStatus.unpublished) {
    this._published = status;
  }

  public publish(status: typeof PublishStatus.published) {
    this._published = status;
  }
}
