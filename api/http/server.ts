import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { Application, Router } from "@oak/oak";
import { TaxCalculatorApi } from "@adapters/inbound_adapters/TaxCalculatorApi.ts";
import { CountryTaxRepository } from "@adapters/outbound_adapters/sqlite/CountryTaxRepository.ts";
const router = new Router();

router.get("/:amount", (ctx) => {
  const db = new DB("hexagonal_app.sqlite");
  const dbRepo = new CountryTaxRepository(db);
  const calculator = new TaxCalculatorApi(dbRepo);
  ctx.response.body = calculator.taxOnDefault(Number(ctx.params.amount));
});

router.get("/calc/:country/:amount", (ctx) => {
  const db = new DB("hexagonal_app.sqlite");
  const dbRepo = new CountryTaxRepository(db);

  const calculator = new TaxCalculatorApi(dbRepo);
  ctx.response.body = calculator.taxDependOnCountry(
    ctx.params.country,
    Number(ctx.params.amount),
  );
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
