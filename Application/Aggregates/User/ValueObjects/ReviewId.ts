export class ReviewId {
  private constructor(private _reviewId: string) {}

  public static parse(value: any) {
    if (!value) {
      throw new Error("no uuid provided");
    }

    return new ReviewId(value);
  }

  public static fromPersistence(id: string) {
    return new ReviewId(id);
  }

  public get id(): string {
    return this._reviewId;
  }
}
