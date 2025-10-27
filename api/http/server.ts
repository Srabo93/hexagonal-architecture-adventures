import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { Application, Router } from "@oak/oak";
import { TaxCalculatorApi } from "@adapters/inbound_adapters/TaxCalculatorApi.ts";
import { CountryTaxRepository } from "@adapters/outbound_adapters/sqlite/CountryTaxRepository.ts";
import { UserApi } from "@adapters/inbound_adapters/UserApi.ts";
import { InMemoryUserRepository } from "../../tests/outbound_adapters/doubles/InMemoryUserRepository.ts";
const router = new Router();

router.post("/user", async (ctx) => {
  // const db = new DB("hexagonal_app.sqlite");
  // const dbRepo = new CountryTaxRepository(db);
  const dbRepo = new InMemoryUserRepository();

  const { email, name, role } = await ctx.request.body.json();

  const userApi = new UserApi(dbRepo);
  const newUser = userApi.create(email, name, role);

  ctx.response.status = 201;
  ctx.response.body = newUser;
});

router.get("/user/:id", async (ctx) => {
  // const db = new DB("hexagonal_app.sqlite");
  // const dbRepo = new CountryTaxRepository(db);
  const dbRepo = new InMemoryUserRepository();

  const userApi = new UserApi(dbRepo);
  const retrievedUser = await userApi.findById(ctx.params.id);

  ctx.response.body = retrievedUser;
});

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
