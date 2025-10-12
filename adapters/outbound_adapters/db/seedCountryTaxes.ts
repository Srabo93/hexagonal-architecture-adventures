import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { CountryTaxSqliteRepository } from "./CountryTaxSqliteRepository.ts";
import { CountryTax } from "@application/entities/CountryTax.ts";

const db = new DB("hexagonal_app.sqlite");
const countryRepo = new CountryTaxSqliteRepository(db);

const dummyCountries: CountryTax[] = [
  new CountryTax("germany", 1.19),
  new CountryTax("uSA", 1.07),
  new CountryTax("japan", 1.1),
  new CountryTax("france", 1.2),
  new CountryTax("uk", 1.15),
  new CountryTax("canada", 1.12),
  new CountryTax("australia", 1.18),
  new CountryTax("brazil", 1.17),
  new CountryTax("india", 1.18),
  new CountryTax("china", 1.16),
];

dummyCountries.forEach((countryTax) => {
  countryRepo.save(countryTax);
});

console.log("✅ Seeded 10 dummy country taxes successfully.");
db.close();
