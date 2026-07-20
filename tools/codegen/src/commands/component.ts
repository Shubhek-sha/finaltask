import path from "node:path";
import type { Command } from "commander";
import { TEMPLATES_ROOT, UI_COMPONENTS_ROOT, WEB_MODULES_ROOT } from "../lib/paths";
import { renderTemplate, toNameCase, writeGenerated } from "../lib/render";

interface ComponentOptions {
  package?: string;
  module?: string;
  force?: boolean;
}

export function registerComponentCommand(program: Command): void {
  program
    .command("component <Name>")
    .description(
      "Scaffold a component in packages/ui (--package=ui) or inside a feature module (--module=<name>)",
    )
    .option("--package <pkg>", "target package (currently only 'ui' is supported)")
    .option("--module <module>", "target feature module under apps/web/src/modules")
    .option("-f, --force", "overwrite existing files")
    .action((name: string, opts: ComponentOptions) => {
      if (!opts.package && !opts.module) {
        throw new Error("Specify a target: --package=ui or --module=<name>");
      }
      if (opts.package && opts.module) {
        throw new Error("Pass either --package or --module, not both.");
      }

      const n = toNameCase(name);
      const context = { name: n };

      if (opts.package) {
        if (opts.package !== "ui") {
          throw new Error(`Unknown package "${opts.package}". Only "ui" is supported.`);
        }

        const dir = path.join(UI_COMPONENTS_ROOT, n.kebab);
        const files: Array<[string, string]> = [
          ["component-ui/Component.tsx.hbs", `${n.pascal}.tsx`],
          ["component-ui/Component.stories.tsx.hbs", `${n.pascal}.stories.tsx`],
          ["component-ui/index.ts.hbs", "index.ts"],
        ];

        for (const [tpl, outFile] of files) {
          writeGenerated(
            path.join(dir, outFile),
            renderTemplate(path.join(TEMPLATES_ROOT, tpl), context),
            opts.force,
          );
        }

        console.log(`Created component "${n.pascal}" at packages/ui/src/components/${n.kebab}/`);
        console.log(`Remember to re-export it from packages/ui/src/index.ts`);
        return;
      }

      const moduleDir = path.join(WEB_MODULES_ROOT, opts.module as string, "components");
      const files: Array<[string, string]> = [
        ["component-module/Component.tsx.hbs", `${n.pascal}.tsx`],
        ["component-module/Component.test.tsx.hbs", `${n.pascal}.test.tsx`],
      ];

      for (const [tpl, outFile] of files) {
        writeGenerated(
          path.join(moduleDir, outFile),
          renderTemplate(path.join(TEMPLATES_ROOT, tpl), context),
          opts.force,
        );
      }

      console.log(`Created component "${n.pascal}" at apps/web/src/modules/${opts.module}/components/`);
    });
}
