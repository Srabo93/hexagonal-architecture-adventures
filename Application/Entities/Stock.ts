import { StockAmount } from "#Application/ValueObjects/StockAmount.ts";
import {
  setStatus,
  StockAvailabilityStatus,
} from "#Application/ValueObjects/StockAvailabilityStatus.ts";

/**
 * @class is an Entity
 */
export class Stock {
  public get amount(): StockAmount {
    return this._amount;
  }
  public get availability(): StockAvailabilityStatus {
    return this._availability;
  }

  private constructor(
    private _amount: StockAmount,
    private _availability: StockAvailabilityStatus,
  ) {}

  public static create(
    amount: StockAmount,
    availability: StockAvailabilityStatus,
  ) {
    return new Stock(amount, availability);
  }

  public addStock(amount: StockAmount) {
    this._amount = StockAmount.parse(this._amount.value + amount.value);
    this._availability = setStatus(this._amount.value);
    return true;
  }

  public subtractStock(amount: StockAmount) {
    if (this._amount.value - amount.value < 0) {
      throw new Error("Out of Stock");
    }
    this._amount = StockAmount.parse(this._amount.value - amount.value);
    this._availability = setStatus(this._amount.value);
    return true;
  }
}
