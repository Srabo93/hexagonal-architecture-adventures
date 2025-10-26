import { assertEquals } from "@std/assert";
import { TaxCalculatorApi } from "@adapters/inbound_adapters/TaxCalculatorApi.ts";
import { CountryTax } from "@application/services/CountryTax.ts";
import { InMemoryCountryTaxRepository } from "../outbound_adapters/interactor/InMemoryCountryTaxRepository.ts";

Deno.test("TaxCalculator Api calculates default correctly", () => {
  const inMemRepo = new InMemoryCountryTaxRepository([]);
  const calculator = new TaxCalculatorApi(inMemRepo);

  assertEquals(calculator.taxOnDefault(100), 119);
});

Deno.test("TaxCalculator Api calculates correctly depending on Country", () => {
  const inMemRepo = new InMemoryCountryTaxRepository([
    new CountryTax("Germany", 1.19),
    new CountryTax("USA", 1.07),
  ]);
  const calculator = new TaxCalculatorApi(inMemRepo);

  assertEquals(calculator.taxDependOnCountry("Germany", 100), 119);
  assertEquals(calculator.taxDependOnCountry("USA", 100), 107);
});
