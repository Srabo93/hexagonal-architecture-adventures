export interface ForCalculatingtax {
  taxOnDefault(amount: number): number;
  taxDependOnCountry(country: string, amount: number): number;
}
