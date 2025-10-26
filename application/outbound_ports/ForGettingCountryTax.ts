import { CountryTax } from "../services/CountryTax.ts";

export interface ForGettingCountryTax {
  findAll(): CountryTax[];
  find(country: string): CountryTax | null;
  save(countryTax: CountryTax): void;
  delete(country: string): void;
}
