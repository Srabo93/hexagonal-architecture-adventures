import { CountryTax } from "../entities/CountryTax.ts";

export interface CountryTaxRepository {
  findAll(): CountryTax[];
  find(country: string): CountryTax | null;
  save(countryTax: CountryTax): void;
  delete(country: string): void;
}
