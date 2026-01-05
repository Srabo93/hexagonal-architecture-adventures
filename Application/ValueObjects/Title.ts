export class Title {
  private constructor(private readonly value: string) {}

  public static parse(raw: string): Title {
    const normalized = raw.trim();

    if (normalized.length === 0) {
      throw new Error("title cannot be empty");
    }

    if (normalized.length > 200) {
      throw new Error("title is too long");
    }

    return new Title(normalized);
  }

  public get title(): string {
    return this.value;
  }
}
