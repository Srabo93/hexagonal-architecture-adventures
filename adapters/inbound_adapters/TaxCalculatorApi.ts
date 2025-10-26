import { ForCalculatingtax } from "@application/inbound_ports/ForCalculatingTax.ts";
import { TaxCalculator } from "@application/services/TaxCalculator.ts";
import { CountryTaxPersistence } from "@application/outbound_ports/CountryTaxPersistence.ts";

export class TaxCalculatorApi implements ForCalculatingtax {
  constructor(private dbRepository: CountryTaxPersistence) {}
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
