export class ISBN {
  constructor(private _isbn: string) {}

  public static parse(raw: string): ISBN {
    const normalized = raw.trim().replaceAll("-", "").replaceAll(" ", "");

    if (normalized.length === 0) {
      throw new Error("isbn cannot be empty");
    }

    if (normalized.length > 200) {
      throw new Error("isbn is too long");
    }

    return new ISBN(normalized);
  }

  public static fromPersistence(isbn: string) {
    return new ISBN(isbn);
  }

  public get isbn(): string {
    return this._isbn;
  }
}
