import { assertEquals, assertThrows } from "@std/assert";
import { User } from "@application/services/User.ts";

Deno.test("User.create - valid input should create entity correctly", () => {
  const user = User.create({
    name: "Alice",
    email: "ALICE@example.com",
    role: "publisher",
  });

  assertEquals(user.name, "Alice");
  assertEquals(user.email, "alice@example.com");
  assertEquals(user.role, "publisher");
});

Deno.test("User.create - default role should be 'user'", () => {
  const user = User.create({
    name: "Bob",
    email: "bob@example.com",
  });

  assertEquals(user.role, "user");
});

Deno.test("User.create - invalid name should throw error", () => {
  assertThrows(
    () => User.create({ name: "", email: "test@example.com" }),
    Error,
    "Name must be at least 2 characters long.",
  );

  assertThrows(
    () => User.create({ name: "A", email: "test@example.com" }),
    Error,
    "Name must be at least 2 characters long.",
  );
});

Deno.test("User.create - invalid email should throw error", () => {
  assertThrows(
    () => User.create({ name: "Alice", email: "not-an-email" }),
    Error,
    "Invalid email format.",
  );
});

Deno.test("User setters - name should validate correctly", () => {
  const user = User.create({ name: "Alice", email: "alice@example.com" });
  user.name = "Bob";
  assertEquals(user.name, "Bob");

  assertThrows(
    () => {
      user.name = "A";
    },
    Error,
    "Name must be at least 2 characters long.",
  );
});

Deno.test("User setters - email should validate and normalize", () => {
  const user = User.create({ name: "Alice", email: "alice@example.com" });
  user.email = "NEWEMAIL@Example.Com";
  assertEquals(user.email, "newemail@example.com");

  assertThrows(
    () => {
      user.email = "invalid";
    },
    Error,
    "Invalid email format.",
  );
});

Deno.test("User role changes", () => {
  const user = User.create({ name: "Alice", email: "alice@example.com" });
  assertEquals(user.role, "user");

  user.promoteToPublisher();
  assertEquals(user.role, "publisher");

  user.demoteToUser();
  assertEquals(user.role, "user");

  user.role = "publisher";
  assertEquals(user.role, "publisher");
});

Deno.test("User properties getter", () => {
  const user = User.create({
    name: "Alice",
    email: "alice@example.com",
    role: "publisher",
  });
  const props = user.properties;

  assertEquals(props.name, "Alice");
  assertEquals(props.email, "alice@example.com");
  assertEquals(props.role, "publisher");
});
