import path from "node:path";
import type { Command } from "commander";
import { TEMPLATES_ROOT, WEB_MODULES_ROOT } from "../lib/paths";
import { renderTemplate, toNameCase, writeGenerated } from "../lib/render";

export function registerModuleCommand(program: Command): void {
  program
    .command("module <name>")
    .description("Scaffold a new isolated feature module under apps/web/src/modules")
    .option("-f, --force", "overwrite existing files")
    .action((name: string, opts: { force?: boolean }) => {
      const n = toNameCase(name);
      const moduleDir = path.join(WEB_MODULES_ROOT, n.kebab);
      const context = { name: n };

      const files: Array<[string, string]> = [
        ["module/routes.tsx.hbs", "routes.tsx"],
        ["module/Page.tsx.hbs", `${n.pascal}Page.tsx`],
        ["module/Page.test.tsx.hbs", `${n.pascal}Page.test.tsx`],
        ["module/index.ts.hbs", "index.ts"],
      ];

      for (const [templateRelPath, outFile] of files) {
        const rendered = renderTemplate(path.join(TEMPLATES_ROOT, templateRelPath), context);
        writeGenerated(path.join(moduleDir, outFile), rendered, opts.force);
      }

      console.log(`Created module "${n.kebab}" at apps/web/src/modules/${n.kebab}/`);
      for (const [, outFile] of files) {
        console.log(`  apps/web/src/modules/${n.kebab}/${outFile}`);
      }
    });
}
