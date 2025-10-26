import { assertEquals } from "@std/assert";
import { TaxCalculator } from "@application/services/TaxCalculator.ts";

Deno.test("TaxCalculator.taxOnDefault() should apply default 19% tax", () => {
  const calculator = new TaxCalculator();

  const result1 = calculator.taxOnDefault(100);
  const result2 = calculator.taxOnDefault(20);
  const result3 = calculator.taxOnDefault(0);

  assertEquals(result1, 119);
  assertEquals(result2, 23.8);
  assertEquals(result3, 0);
});

Deno.test(
  "TaxCalculator.taxDependOnCountry() should apply provided country tax rate",
  () => {
    const calculator = new TaxCalculator();

    const resultGermany = calculator.taxDependOnCountry(1.19, 100);
    const resultUsa = calculator.taxDependOnCountry(1.07, 100);
    const resultJapan = calculator.taxDependOnCountry(1.1, 50);

    assertEquals(resultGermany, 119);
    assertEquals(resultUsa, 107);
    assertEquals(resultJapan, 55);
  },
);

Deno.test(
  "TaxCalculator.taxDependOnCountry() should round correctly to two decimals",
  () => {
    const calculator = new TaxCalculator();

    const result = calculator.taxDependOnCountry(1.075, 123.45);
    assertEquals(result, 132.71);
  },
);
