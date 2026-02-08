import { describe, expect, it } from "bun:test";

import { Email } from "./Email.ts";

describe("Email Value Object", () => {
  it("should create a valid email", () => {
    const email = Email.parse("test@example.com");
    expect(email.email).toBe("test@example.com");
  });

  it("should create email with subdomain", () => {
    const email = Email.parse("user@mail.example.com");
    expect(email.email).toBe("user@mail.example.com");
  });

  it("should create email with numbers", () => {
    const email = Email.parse("user123@test456.com");
    expect(email.email).toBe("user123@test456.com");
  });

  it("should create email with dots in username", () => {
    const email = Email.parse("john.doe@example.com");
    expect(email.email).toBe("john.doe@example.com");
  });

  it("should create email with plus sign", () => {
    const email = Email.parse("john+test@example.com");
    expect(email.email).toBe("john+test@example.com");
  });

  it("should throw error for email without @", () => {
    expect(() => Email.parse("testexample.com")).toThrow("this is not a valid email");
  });
});

