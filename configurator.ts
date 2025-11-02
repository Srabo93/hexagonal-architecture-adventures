import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { CountryTaxPersistence } from "@application/outbound_ports/CountryTaxPersistence.ts";
import { UserPersistence } from "@application/outbound_ports/UserPersistence.ts";
import { InMemoryCountryTaxRepository } from "./tests/outbound_adapters/doubles/InMemoryCountryTaxRepository.ts";
import { InMemoryUserRepository } from "./tests/outbound_adapters/doubles/InMemoryUserRepository.ts";
import { UserRepository } from "@adapters/outbound_adapters/sqlite/UserRepository.ts";
import { CountryTaxRepository } from "@adapters/outbound_adapters/sqlite/CountryTaxRepository.ts";
import { getDatabase, migrate, seedIfNeeded } from "./database.ts";
import { CountryTax } from "@application/services/CountryTax.ts";
import { User } from "@application/services/User.ts";
import { UserRecord } from "@adapters/anti_corruption_layer/sqlite/UserRecord.ts";
import { randomUUID } from "node:crypto";

export interface AppContext {
  countryTaxRepo: CountryTaxPersistence;
  userRepo: UserPersistence;
}

export function createContext(): AppContext {
  const env = Deno.env.get("APP_ENV");

  switch (env) {
    case "test": {
      const dummyCountries: CountryTax[] = [
        new CountryTax("germany", 1.19),
        new CountryTax("usa", 1.07),
        new CountryTax("japan", 1.1),
        new CountryTax("france", 1.2),
        new CountryTax("uk", 1.15),
        new CountryTax("canada", 1.12),
        new CountryTax("australia", 1.18),
        new CountryTax("brazil", 1.17),
        new CountryTax("india", 1.18),
        new CountryTax("china", 1.16),
      ];

      const dummyUsers: UserRecord[] = [
        {
          id: randomUUID(),
          user: User.create({
            name: "john",
            email: "john@doe.com",
            role: "user",
          }),
          createdAt: new Date().toISOString(),
        },
        {
          id: randomUUID(),
          user: User.create({
            name: "jane",
            email: "jane@doe.com",
            role: "publisher",
          }),
          createdAt: new Date().toISOString(),
        },
      ];
      return {
        userRepo: new InMemoryUserRepository(dummyUsers),
        countryTaxRepo: new InMemoryCountryTaxRepository(dummyCountries),
      };
    }

    case "dev": {
      const database = getDatabase("dev");
      migrate(database);
      const userRepo = new UserRepository(database);
      const countryTaxRepo = new CountryTaxRepository(database);
      seedIfNeeded(userRepo, countryTaxRepo, database);

      return {
        userRepo,
        countryTaxRepo,
      };
    }

    case "prod": {
      const database = getDatabase("prod");
      migrate(database);

      const userRepo = new UserRepository(database);
      const countryTaxRepo = new CountryTaxRepository(database);

      return {
        userRepo,
        countryTaxRepo,
      };
    }
    default:
      throw new Error(`Unknown APP_ENV: ${env}`);
  }
}
