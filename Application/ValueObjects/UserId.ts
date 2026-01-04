export class UserId {
  private constructor(private _uuid: string) {}

  public set uuid(value: string) {
    if (!this.uuid) {
      throw new Error("no uuid provided");
    }

    this._uuid = value;
  }

  public get uuid(): string {
    return this._uuid;
  }
}
