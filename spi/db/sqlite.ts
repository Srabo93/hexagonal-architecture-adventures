import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { CountryTaxSqliteSeed } from "@adapters/outbound_adapters/db/CountryTaxSqliteSeed.ts";
import { CountryTaxSqliteRepository } from "@adapters/outbound_adapters/db/CountryTaxSqliteRepository.ts";

const db = new DB("hexagonal_app.sqlite");
const countryRepo = new CountryTaxSqliteRepository(db);
const seeder = new CountryTaxSqliteSeed(countryRepo);
seeder.seedCountryTax();
db.close();
