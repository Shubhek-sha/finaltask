import path from "node:path";
import type { Command } from "commander";
import { TEMPLATES_ROOT, WEB_MODULES_ROOT } from "../lib/paths";
import { renderTemplate, toNameCase, writeGenerated } from "../lib/render";

export function registerHookCommand(program: Command): void {
  program
    .command("hook <name>")
    .description("Scaffold a hook inside a feature module (e.g. useProjectFilters)")
    .requiredOption("--module <module>", "target feature module under apps/web/src/modules")
    .option("-f, --force", "overwrite existing files")
    .action((name: string, opts: { module: string; force?: boolean }) => {
      const bare = name.replace(/^use[-_]?/i, "");
      const n = toNameCase(bare);
      const hookName = `use${n.pascal}`;
      const context = { name: n, hookName };

      const dir = path.join(WEB_MODULES_ROOT, opts.module, "hooks");
      const files: Array<[string, string]> = [
        ["hook/useHook.ts.hbs", `${hookName}.ts`],
        ["hook/useHook.test.ts.hbs", `${hookName}.test.ts`],
      ];

      for (const [tpl, outFile] of files) {
        writeGenerated(
          path.join(dir, outFile),
          renderTemplate(path.join(TEMPLATES_ROOT, tpl), context),
          opts.force,
        );
      }

      console.log(`Created hook "${hookName}" at apps/web/src/modules/${opts.module}/hooks/`);
    });
}
