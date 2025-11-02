import { CountryTax } from "@application/services/CountryTax.ts";
import { CountryTaxPersistence } from "@application/outbound_ports/CountryTaxPersistence.ts";

export class CountryTaxRepository implements CountryTaxPersistence {
  private db;
  constructor(db: any) {
    this.db = db;
  }

  findAll(): CountryTax[] {
    const rows = [
      ...this.db.query("SELECT country, tax_rate FROM country_taxes"),
    ];
    return rows.map(
      ([country, taxRate]) =>
        new CountryTax(country as string, taxRate as number),
    );
  }

  find(country: string): CountryTax | null {
    const row = [
      ...this.db.query(
        "SELECT country, tax_rate FROM country_taxes WHERE country = ?",
        [country],
      ),
    ];
    if (!row.length) return null;
    const [c, rate] = row[0];
    return new CountryTax(c as string, rate as number);
  }

  save(countryTax: CountryTax): void {
    this.db.query(
      "INSERT OR REPLACE INTO country_taxes (country, tax_rate) VALUES (?, ?)",
      [countryTax.country, countryTax.taxRate],
    );
  }

  delete(country: string): void {
    this.db.query("DELETE FROM country_taxes WHERE country = ?", [country]);
  }
}
