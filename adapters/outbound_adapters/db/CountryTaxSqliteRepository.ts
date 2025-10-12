import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { CountryTax } from "@application/entities/CountryTax.ts";
import { CountryTaxRepository } from "@application/outbound_ports/CountryTaxRepository.ts";

export class CountryTaxSqliteRepository implements CountryTaxRepository {
  private db: DB;

  constructor(db: DB) {
    this.db = db;
    this.setup();
  }

  private setup() {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS country_taxes (
        country TEXT PRIMARY KEY,
        tax_rate REAL NOT NULL
      )
    `);
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
