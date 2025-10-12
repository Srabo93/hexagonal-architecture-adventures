import { assertEquals } from "@std/assert";
import { InMemoryCountryTaxesDB } from "./InMemoryCountryTaxesDB.ts";
import { CountryTax } from "@application/entities/CountryTax.ts";

Deno.test("InMemoryCountryTaxesDB basic operations", () => {
  const repo = new InMemoryCountryTaxesDB([
    new CountryTax("Germany", 1.19),
    new CountryTax("USA", 1.07),
  ]);

  const all = repo.findAll();
  assertEquals(all.length, 2);

  const germany = repo.find("Germany");
  assertEquals(germany?.taxRate, 1.19);

  repo.save(new CountryTax("France", 1.2));
  assertEquals(repo.findAll().length, 3);

  repo.delete("USA");
  assertEquals(repo.findAll().length, 2);
  assertEquals(repo.find("USA"), null);
});
