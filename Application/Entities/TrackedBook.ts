import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";

export class TrackedBook {
  constructor(
    public readonly isbn: ISBN,
    private _status: ReadingStatus,
  ) {}

  public updateStatus(status: ReadingStatus) {
    this._status = status;
  }

  public get status() {
    return this._status;
  }
}
