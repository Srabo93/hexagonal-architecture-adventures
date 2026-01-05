export class Email {
  private constructor(private _email: string) {}

  public static parse(email: string) {
    if (!email.includes("@")) {
      throw new Error("this is not a valid email");
    }
    return new Email(email);
  }

  public get email(): string {
    return this._email;
  }
}
