import { assertEquals } from "@std/assert";
import { UserMapper } from "@adapters/outbound_adapters/sqlite/mappers/UserMapper.ts";
import { User } from "@application/services/User.ts";
import { InMemoryUserRepository } from "./interactor/InMemoryUserRepository.ts";

const dummyUsers: User[] = [
  User.create({
    name: "john",
    email: "john@doe.com",
    role: "user",
  }),
  User.create({
    name: "jane",
    email: "jane@doe.com",
    role: "publisher",
  }),
  User.create({
    name: "Django",
    email: "django@unchained.com",
  }),
];

const memoryUserRepo = new InMemoryUserRepository([]);

dummyUsers.forEach((user) => {
  memoryUserRepo.save(user);
});

Deno.test("UserMapper maps sql persistence entity to domain entity", () => {
  const presitenceUser = memoryUserRepo.findByEmail("john@doe.com");

  if (presitenceUser === null) {
    console.log("for some reason no user in the db");
    return;
  }
  const toDomain = UserMapper.toDomain(presitenceUser);

  assertEquals(
    toDomain,
    User.create({ name: "john", email: "john@doe.com", role: "user" }),
  );
});
