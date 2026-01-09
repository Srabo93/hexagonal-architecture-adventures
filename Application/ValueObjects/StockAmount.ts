export class StockAmount {
  private constructor(private readonly _value: number) {}

  public static parse(raw: number) {
    if (raw < 0) {
      throw new Error("number cant be negative");
    }

    if (!Number.isInteger(raw)) {
      throw new Error("provided number is not an integer");
    }
    return new StockAmount(raw);
  }

  public get value(): number {
    return this._value;
  }
}
