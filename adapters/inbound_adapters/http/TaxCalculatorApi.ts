import { TaxCalculator } from "@application/entities/TaxCalculator.ts";
import { CountryTaxRepository } from "@application/outbound_ports/CountryTaxRepository.ts";
import { ForCalculatingtax } from "@application/inbound_ports/ForCalculatingTax.ts";

export class TaxCalculatorApi implements ForCalculatingtax {
  constructor(private dbRepository: CountryTaxRepository) {}
  taxOnDefault(amount: number): number {
    const calculator = new TaxCalculator();
    return calculator.taxOnDefault(amount);
  }
  taxDependOnCountry(country: string, amount: number): number {
    const countryFound = this.dbRepository.find(country);
    if (!countryFound) {
      throw new Error(`No tax rate found for country: ${country}`);
    }

    const calculator = new TaxCalculator();
    return calculator.taxDependOnCountry(countryFound.taxRate, amount);
  }
}
