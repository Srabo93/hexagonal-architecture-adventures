export class ISBN {
  constructor(private _isbn: string) {}

  public static parse(raw: string): ISBN {
    const normalized = raw.trim();

    if (normalized.length === 0) {
      throw new Error("isbn cannot be empty");
    }

    if (normalized.length > 200) {
      throw new Error("isbn is too long");
    }

    return new ISBN(normalized);
  }

  public get isbn(): string {
    return this._isbn;
  }
}
