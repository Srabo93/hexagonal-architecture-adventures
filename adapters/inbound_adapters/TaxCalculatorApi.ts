import { ForCalculatingtax } from "@application/inbound_ports/ForCalculatingTax.ts";
import { TaxCalculator } from "@application/services/TaxCalculator.ts";
import { ForGettingCountryTax } from "@application/outbound_ports/ForGettingCountryTax.ts";

export class TaxCalculatorApi implements ForCalculatingtax {
  constructor(private dbRepository: ForGettingCountryTax) {}
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
