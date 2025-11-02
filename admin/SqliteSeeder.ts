import { CountryTax } from "@application/services/CountryTax.ts";
import { User } from "@application/services/User.ts";
import { CountryTaxPersistence } from "@application/outbound_ports/CountryTaxPersistence.ts";
import { UserPersistence } from "@application/outbound_ports/UserPersistence.ts";

export class SqliteSeeder {
  constructor(
    private readonly countryRepo: CountryTaxPersistence,
    private readonly userRepo: UserPersistence,
  ) {}

  public seed() {
    const dummyCountries: CountryTax[] = [
      new CountryTax("germany", 1.19),
      new CountryTax("usa", 1.07),
      new CountryTax("japan", 1.1),
      new CountryTax("france", 1.2),
      new CountryTax("uk", 1.15),
      new CountryTax("canada", 1.12),
      new CountryTax("australia", 1.18),
      new CountryTax("brazil", 1.17),
      new CountryTax("india", 1.18),
      new CountryTax("china", 1.16),
    ];

    dummyCountries.forEach((countryTax) => {
      this.countryRepo.save(countryTax);
    });

    const dummyUsers: User[] = [
      User.create({
        name: "john",
        email: "john@doe.com",
        role: "user",
      }),
      User.create({
        name: "jane",
        email: "jane@doe.com",
        role: "publisher",
      }),
    ];
    dummyUsers.forEach((user) => {
      this.userRepo.save(user);
    });

    console.log(
      "✅ Seeded 10 dummy country taxes successfully. \n ✅ Seeded 2 dummy users successfully.",
    );
  }
}
