import { createPostgresDB } from "DB/Postgres/client";
import "reflect-metadata";
import { container } from "tsyringe";

import type { AuthorRepository } from "./Application/Driven/AuthorRepository.js";
import type { UserRepository } from "./Application/Driven/UserRepository.js";

import { JsonAuthorRepository } from "./Adapters/Driven/JsonAuthorRepository.js";
import { JsonUserRepository } from "./Adapters/Driven/JsonUserRepository.js";
import { PostgresAuthorRepository } from "./Adapters/Driven/PostgresAuthorRepository.js";
import { PostgresUserRepository } from "./Adapters/Driven/PostgresUserRepository.js";
import { CLIAuthorAdapter } from "./Adapters/Driving/CLIAuthorAdapter.js";
import { CLIUserAdapter } from "./Adapters/Driving/CLIUserAdapter.js";

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
    const db = await createPostgresDB();
    container.register<UserRepository>("UserRepository", {
      useValue: new PostgresUserRepository(db),
    });
    container.register<AuthorRepository>("AuthorRepository", {
      useValue: new PostgresAuthorRepository(db),
    });

    break;

  case "prod":
    break;
}

export const cliUserAdapter = container.resolve(CLIUserAdapter);
export const cliAuthorAdapter = container.resolve(CLIAuthorAdapter);
