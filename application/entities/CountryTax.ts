export class CountryTax {
  constructor(
    public readonly country: string,
    public readonly taxRate: number,
  ) {
    if (taxRate <= 0) {
      throw new Error("Tax rate must be greater than zero");
    }
  }
}
