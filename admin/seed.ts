import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { CountryTaxRepository } from "@adapters/outbound_adapters/sqlite/CountryTaxRepository.ts";
import { UserRepository } from "@adapters/outbound_adapters/sqlite/UserRepository.ts";
import { SqliteSeeder } from "./SqliteSeeder.ts";

const db = new DB("hexagonal_app.sqlite");
const countryRepo = new CountryTaxRepository(db);
const userRepo = new UserRepository(db);
const seeder = new SqliteSeeder(countryRepo, userRepo);
seeder.seed();
db.close();
