import { CountryTax } from "../services/CountryTax.ts";

export interface CountryTaxPersistence {
  findAll(): CountryTax[];
  find(country: string): CountryTax | null;
  save(countryTax: CountryTax): void;
  delete(country: string): void;
}
