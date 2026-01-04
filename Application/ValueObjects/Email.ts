export class Email {
  private constructor(private _email: string) {}

  public parse(email: string) {
    if (!email.includes("@")) {
      throw new Error("this is not a valid email");
    }
    this._email = email;
  }

  public get email(): string {
    return this._email;
  }
}
