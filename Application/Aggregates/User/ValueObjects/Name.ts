export class Name {
  private constructor(
    private readonly _firstName: string,
    private readonly _lastName: string,
  ) {}

  public static parse(raw: string): Name {
    const parts = raw.trim().split(/\s+/);

    if (parts.length < 2) {
      throw new Error("Name must contain at least first and last name");
    }

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];

    if (!firstName || !lastName) {
      throw new Error("Invalid name format");
    }

    return new Name(firstName, lastName);
  }

  public static fromPersistence(value: string) {
    const parts = value.trim().split(/\s+/);

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];

    if (!firstName || !lastName) {
      throw new Error("Invalid name format");
    }

    return new Name(firstName, lastName);
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }
}
