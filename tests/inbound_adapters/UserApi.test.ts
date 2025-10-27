import { assertEquals } from "@std/assert";
import { stub } from "jsr:@std/testing/mock";
import { UserApi } from "@adapters/inbound_adapters/UserApi.ts";
import { User } from "@application/services/User.ts";
import { InMemoryUserRepository } from "../outbound_adapters/doubles/InMemoryUserRepository.ts";
import userStub from "./stubs/user.json" with { type: "json" };

Deno.test("User Api creates a user with InMemoryUserRepository", () => {
  const inMemRepo = new InMemoryUserRepository();
  const newUser = new UserApi(inMemRepo).create("jim@doe.com", "jim", "user");

  assertEquals(
    newUser,
    User.create({ email: "jim@doe.com", name: "jim", role: "user" }),
  );
});

Deno.test("UserApi.findById returns domain User from mock fetch", async () => {
  const originalFetch = globalThis.fetch;

  const mockResponse = new Response(JSON.stringify(userStub), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  globalThis.fetch = stub(
    globalThis,
    "fetch",
    (_input: string | URL | Request, _init?: RequestInit) =>
      Promise.resolve(mockResponse),
  );
  try {
    const repo = new InMemoryUserRepository();
    const userApi = new UserApi(repo);
    const user = await userApi.findById("1");

    assertEquals(user.name, userStub.name);
    assertEquals(user.email, userStub.email.toLowerCase());
  } finally {
    globalThis.fetch = originalFetch;
  }
});
