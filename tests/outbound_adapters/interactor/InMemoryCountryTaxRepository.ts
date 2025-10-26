import { ForGettingCountryTax } from "@application/outbound_ports/ForGettingCountryTax.ts";
import { CountryTax } from "@application/services/CountryTax.ts";

export class InMemoryCountryTaxRepository implements ForGettingCountryTax {
  private memory: Map<string, CountryTax>;

  constructor(initialData: CountryTax[] = []) {
    this.memory = new Map(
      initialData.map((ct) => [ct.country.toLowerCase(), ct]),
    );
  }

  findAll() {
    return Array.from(this.memory.values());
  }

  find(country: string): CountryTax | null {
    return this.memory.get(country.toLowerCase()) ?? null;
  }

  save(countryTax: CountryTax): void {
    this.memory.set(countryTax.country.toLowerCase(), countryTax);
  }

  delete(country: string): void {
    this.memory.delete(country.toLowerCase());
  }
}
