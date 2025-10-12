import { TaxCalculator } from "@application/entities/TaxCalculator.ts";
import { CountryTaxRepository } from "@application/outbound_ports/CountryTaxRepository.ts";

export class TaxCalculatorApi {
  constructor(private dbRepository: CountryTaxRepository) {}

  taxForCountry(country: string, amount: number): number {
    const countryFound = this.dbRepository.find(country);
    if (!countryFound) {
      throw new Error(`No tax rate found for country: ${country}`);
    }

    const calculator = new TaxCalculator();
    return calculator.taxDependOnCountry(countryFound.taxRate, amount);
  }

  taxDefault(amount: number): number {
    const calculator = new TaxCalculator();
    return calculator.taxOnDefault(amount);
  }
}
