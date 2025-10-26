export class User {
  private constructor(
    private _name: string,
    private _email: string,
    private _role: "user" | "publisher",
  ) {}

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long.");
    }
    this._name = value.trim();
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Invalid email format.");
    }
    this._email = value.toLowerCase();
  }

  get role(): "user" | "publisher" {
    return this._role;
  }

  set role(value: "user" | "publisher") {
    this._role = value ?? "user";
  }

  private validate(): void {
    this.name = this._name;
    this.email = this._email;
    this.role = this._role;
  }

  static create(params: {
    name: string;
    email: string;
    role?: "user" | "publisher";
  }): User {
    const role = params.role ?? "user";
    const user = new User(params.name, params.email, role);
    user.validate();
    return user;
  }

  get properties() {
    return {
      name: this._name,
      email: this._email,
      role: this._role,
    };
  }

  promoteToPublisher(): void {
    this._role = "publisher";
  }

  demoteToUser(): void {
    this._role = "user";
  }
}
