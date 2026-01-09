import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { ReadingStatus } from "#Application/ValueObjects/ReadingStatus.ts";

export class TrackedBook {
  private constructor(
    private _isbn: ISBN,
    private _status: ReadingStatus,
  ) {}

  public static create(isbn: ISBN, status: ReadingStatus) {
    return new TrackedBook(isbn, status);
  }

  public updateStatus(status: ReadingStatus) {
    this._status = status;
  }

  public get status() {
    return this._status;
  }

  public get isbn(): ISBN {
    return this._isbn;
  }
}
