import fs from "node:fs";
import path from "node:path";
import Handlebars from "handlebars";
import { camelCase, capitalCase, kebabCase, pascalCase } from "change-case";

export interface NameCase {
  raw: string;
  kebab: string;
  pascal: string;
  camel: string;
  title: string;
}

export function toNameCase(input: string): NameCase {
  const kebab = kebabCase(input);
  return {
    raw: input,
    kebab,
    pascal: pascalCase(kebab),
    camel: camelCase(kebab),
    title: capitalCase(kebab),
  };
}

export function renderTemplate(templatePath: string, context: Record<string, unknown>): string {
  const source = fs.readFileSync(templatePath, "utf8");
  const template = Handlebars.compile(source, { noEscape: true });
  return template(context);
}

export function writeGenerated(targetPath: string, contents: string, force = false): void {
  if (fs.existsSync(targetPath) && !force) {
    throw new Error(
      `Refusing to overwrite existing file: ${path.relative(process.cwd(), targetPath)} (pass --force to overwrite)`,
    );
  }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, contents, "utf8");
}
