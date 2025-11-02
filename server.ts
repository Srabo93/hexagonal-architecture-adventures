import { Application, Router } from "@oak/oak";
import { TaxCalculatorApi } from "@adapters/inbound_adapters/TaxCalculatorApi.ts";
import { UserApi } from "@adapters/inbound_adapters/UserApi.ts";
import { createContext } from "./configurator.ts";

const router = new Router();
const appConfig = createContext();

router.post("/user", async (ctx) => {
  const { email, name, role } = await ctx.request.body.json();

  const userApi = new UserApi(appConfig.userRepo);
  const newUser = userApi.create(email, name, role);

  ctx.response.status = 201;
  ctx.response.body = newUser;
});

router.get("/user/:id", async (ctx) => {
  const userApi = new UserApi(appConfig.userRepo);
  const retrievedUser = await userApi.findById(ctx.params.id);

  ctx.response.body = retrievedUser;
});

router.get("/:amount", (ctx) => {
  const calculator = new TaxCalculatorApi(appConfig.countryTaxRepo);
  ctx.response.body = calculator.taxOnDefault(Number(ctx.params.amount));
});

router.get("/calc/:country/:amount", (ctx) => {
  const calculator = new TaxCalculatorApi(appConfig.countryTaxRepo);

  ctx.response.body = calculator.taxDependOnCountry(
    ctx.params.country,
    Number(ctx.params.amount),
  );
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
