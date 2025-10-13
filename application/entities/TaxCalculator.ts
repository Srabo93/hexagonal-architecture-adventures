export class TaxCalculator {
  taxDependOnCountry(countryTax: number, amount: number): number {
    return Number((amount * countryTax).toFixed(2));
  }

  taxOnDefault(amount: number): number {
    return Number((amount * 1.19).toFixed(2));
  }
}
