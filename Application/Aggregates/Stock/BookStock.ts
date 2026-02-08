import { Stock } from "#Aggregates/Stock/Entities/Stock.js";
import { StockAmount } from "#Aggregates/Stock/ValueObjects/StockAmount.js";
import { StockAvailabilityStatus, setStatus } from "#Aggregates/Stock/ValueObjects/StockAvailabilityStatus.js";

/**
 * @class is an Aggregate Root
 */
export class BookStock {
  private constructor(
    private _version: number,
    private _isbn: string,
    private _stock: Stock,
  ) {}

  public static create(isbn: string, amount: StockAmount): BookStock {
    const stock = Stock.create(amount, setStatus(amount.value));
    return new BookStock(0, isbn, stock);
  }

  public static rehydrate(
    version: number,
    isbn: string,
    amount: StockAmount,
    availability: StockAvailabilityStatus,
  ): BookStock {
    const stock = Stock.create(amount, availability);
    return new BookStock(version, isbn, stock);
  }

  public get version(): number {
    return this._version;
  }

  public get isbn(): string {
    return this._isbn;
  }

  public get stock(): Stock {
    return this._stock;
  }

  public bumpVersion() {
    this._version++;
  }

  public addStock(amount: StockAmount) {
    this._stock.addStock(amount);
    return this;
  }

  public subtractStock(amount: StockAmount) {
    this._stock.subtractStock(amount);
    return this;
  }
}