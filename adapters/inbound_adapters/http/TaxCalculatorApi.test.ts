import { assertEquals } from "@std/assert";
import { TaxCalculatorApi } from "./TaxCalculatorApi.ts";
import { InMemoryCountryTaxesDB } from "../../outbound_adapters/db/InMemoryCountryTaxesDB.ts";
import { CountryTax } from "@application/entities/CountryTax.ts";

Deno.test("TaxCalculator Api calculates default correctly", () => {
  const inMemDB = new InMemoryCountryTaxesDB([]);
  const calculator = new TaxCalculatorApi(inMemDB);

  assertEquals(calculator.taxOnDefault(100), 119);
});

Deno.test("TaxCalculator Api calculates correctly depending on Country", () => {
  const inMemDB = new InMemoryCountryTaxesDB([
    new CountryTax("Germany", 1.19),
    new CountryTax("USA", 1.07),
  ]);
  const calculator = new TaxCalculatorApi(inMemDB);

  assertEquals(calculator.taxDependOnCountry("Germany", 100), 119);
  assertEquals(calculator.taxDependOnCountry("USA", 100), 107);
});
