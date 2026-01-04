export class ReviewId {
  private constructor(private _reviewId: string) {}

  public set id(value: string) {
    if (!this._reviewId) {
      throw new Error("no uuid provided");
    }

    this._reviewId = value;
  }

  public get id(): string {
    return this._reviewId;
  }
}
