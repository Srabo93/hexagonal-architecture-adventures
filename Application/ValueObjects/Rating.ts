export class Rating {
  private constructor(private _rating: number) {}

  public static parseInteger(int: number) {
    if (!Number.isInteger(int)) {
      throw new Error("no integer provided");
    }

    return new Rating(int);
  }

  public static fromPersistence(int: number) {
    return new Rating(int);
  }

  public get rating(): number {
    return this._rating;
  }
}
