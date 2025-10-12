import { CountryTax } from "@application/entities/CountryTax.ts";
import { CountryTaxRepository } from "@application/outbound_ports/CountryTaxRepository.ts";

export class InMemoryCountryTaxesDB implements CountryTaxRepository {
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
