export interface ForCalculatingtax {
  taxOnDefault(amount: number): number;
  taxDependOnCountry(countryTax: number, amount: number): number;
}
