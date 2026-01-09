import { JsonUserRepository } from "#Adapters/Driven/JsonUserRepository.ts";
import { CLIUserAdapter } from "#Adapters/Driving/CLIUserAdapter.ts";

const repo = new JsonUserRepository("./DB/Disk/users.json");
const cliUserAdapter = new CLIUserAdapter(repo);

export { cliUserAdapter };
