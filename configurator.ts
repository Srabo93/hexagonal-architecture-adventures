import { db as postgresDB } from "DB/Postgres/client";
import "reflect-metadata";
import { container } from "tsyringe";

import type { AuthorRepository } from "#Application/Driven/AuthorRepository.ts";
import type { UserRepository } from "#Application/Driven/UserRepository.ts";

import { JsonAuthorRepository } from "#Adapters/Driven/JsonAuthorRepository.ts";
import { JsonUserRepository } from "#Adapters/Driven/JsonUserRepository.ts";
import { PostgresUserRepository } from "#Adapters/Driven/PostgresUserRepository.ts";
import { CLIAuthorAdapter } from "#Adapters/Driving/CLIAuthorAdapter.ts";
import { CLIUserAdapter } from "#Adapters/Driving/CLIUserAdapter.ts";

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
    container.register<AuthorRepository>("AuthorRepository", {
      useFactory: () => new JsonAuthorRepository("./DB/Disk/authors.json"),
    });
    break;

  case "integration":
    container.register<UserRepository>("UserRepository", {
      useFactory: () => new PostgresUserRepository(postgresDB),
    });

    break;

  case "prod":
    break;
}

export const cliUserAdapter = container.resolve(CLIUserAdapter);
export const cliAuthorAdapter = container.resolve(CLIAuthorAdapter);
