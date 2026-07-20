import { Command } from "commander";
import { registerComponentCommand } from "./commands/component";
import { registerHookCommand } from "./commands/hook";
import { registerModuleCommand } from "./commands/module";

const program = new Command();
program
  .name("forge-gen")
  .description("Scaffolds Forge feature modules, components, and hooks from templates.");

registerModuleCommand(program);
registerComponentCommand(program);
registerHookCommand(program);

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
