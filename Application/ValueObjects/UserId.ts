export class UserId {
  private constructor(private _uuid: string) {}

  public static parse(value: string) {
    if (!value) {
      throw new Error("no uuid provided");
    }

    return new UserId(value);
  }

  public static fromPersistence(value: string) {
    return new UserId(value);
  }

  public get uuid(): string {
    return this._uuid;
  }
}
