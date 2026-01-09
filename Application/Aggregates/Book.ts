import type { Author } from "#Application/Entities/Author.ts";
import { Stock } from "#Application/Entities/Stock.ts";
import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { PublishStatus } from "#Application/ValueObjects/PublishStatus.ts";
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

  constructor(
    private _author: Pick<Author, "authorId" | "name">,
    private _stock: Stock,
    private _published: PublishStatus,
    private _isbn: ISBN,
    private _title: Title,
  ) {}

  public purchasedBook(amount: StockAmount) {
    return this.stock.subtractStock(amount);
  }

  public returnedBook(amount: StockAmount) {
    return this.stock.addStock(amount);
  }

  public changeBookTitle(newTitle: Title) {
    this._title = newTitle;
  }

  public unpublish(status: PublishStatus) {
    if (status === "Unpublished") {
      this._published = status;
    }
  }

  public publish(status: PublishStatus) {
    if (status === "Published") {
      this._published = status;
    }
  }
}
