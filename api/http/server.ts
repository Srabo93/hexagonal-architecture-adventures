import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { Application, Router } from "@oak/oak";
import { TaxCalculatorApi } from "@adapters/inbound_adapters/http/TaxCalculatorApi.ts";
import { InMemoryCountryTaxesDB } from "@adapters/outbound_adapters/db/InMemoryCountryTaxesDB.ts";
import { CountryTaxSqliteRepository } from "@adapters/outbound_adapters/db/CountryTaxSqliteRepository.ts";

const router = new Router();

router.get("/:amount", (ctx) => {
  const dbRepo = new InMemoryCountryTaxesDB();
  const calculator = new TaxCalculatorApi(dbRepo);
  ctx.response.body = calculator.taxDefault(Number(ctx.params.amount));
});

router.get("/calc/:country/:amount", (ctx) => {
  const db = new DB("hexagonal_app.sqlite");
  const dbRepo = new CountryTaxSqliteRepository(db);

  const calculator = new TaxCalculatorApi(dbRepo);
  ctx.response.body = calculator.taxForCountry(
    ctx.params.country,
    Number(ctx.params.amount),
  );
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
