import type { ISBN } from "#Application/ValueObjects/ISBN.ts";
import type { Title } from "#Application/ValueObjects/Title.ts";

export class Book {
  constructor(
    private _isbn: ISBN,
    private _title: Title,
  ) {}

  public get title(): Title {
    return this._title;
  }
  public get isbn(): ISBN {
    return this._isbn;
  }
}
