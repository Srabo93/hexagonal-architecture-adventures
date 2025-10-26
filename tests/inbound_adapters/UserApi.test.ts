import { assertEquals } from "@std/assert";
import { UserApi } from "@adapters/inbound_adapters/UserApi.ts";
import { User } from "@application/services/User.ts";
import { InMemoryUserRepository } from "../outbound_adapters/interactor/InMemoryUserRepository.ts";

Deno.test("User Api creates a user with InMemoryUserRepository", () => {
  const inMemRepo = new InMemoryUserRepository();
  const newUser = new UserApi(inMemRepo).create("jim@doe.com", "jim", "user");

  assertEquals(
    newUser,
    User.create({ email: "jim@doe.com", name: "jim", role: "user" }),
  );
});
