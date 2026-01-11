import "reflect-metadata";
import { container } from "tsyringe";
import { CLIUserAdapter } from "#Adapters/Driving/CLIUserAdapter.ts";
import type { UserRepository } from "#Application/Driven/UserRepository.ts";
import { JsonUserRepository } from "#Adapters/Driven/JsonUserRepository.ts";
import { JsonBookRepository } from "#Adapters/Driven/JsonBookRepository.ts";
import type { BookRepository } from "#Application/Driven/BookRepository.ts";
import { CLIBookAdapter } from "#Adapters/Driving/CLIBookAdapter.ts";

type AppEnv = "dev" | "integration" | "prod";

const APP_ENV = (process.env.APP_ENV ?? "dev") as AppEnv;

if (!["dev", "integration", "prod"].includes(APP_ENV)) {
  throw new Error(`Invalid APP_ENV: ${APP_ENV}`);
}

switch (APP_ENV) {
  case "dev":
    container.register<UserRepository>("UserRepository", {
      useFactory: () => new JsonUserRepository("./DB/Disk/users.json"),
    });
    container.register<BookRepository>("BookRepository", {
      useFactory: () => new JsonBookRepository("./DB/Disk/books.json"),
    });
    break;

  case "integration":
    // container.register<UserRepository>("UserRepo", {
    //   useFactory: () =>
    //     new SqlUserRepository({
    //       host: "localhost",
    //       port: 5432,
    //       database: "users",
    //       user: "test",
    //       password: "test",
    //     }),
    // });
    break;

  case "prod":
    // container.register<UserRepository>("UserRepo", {
    //   useFactory: () =>
    //     new SqlUserRepository({
    //       host: process.env.DB_HOST!,
    //       database: process.env.DB_NAME!,
    //       user: process.env.DB_USER!,
    //       password: process.env.DB_PASSWORD!,
    //       ssl: true,
    //     }),
    // });
    break;
}

export const cliUserAdapter = container.resolve(CLIUserAdapter);
export const cliBookAdapter = container.resolve(CLIBookAdapter);
