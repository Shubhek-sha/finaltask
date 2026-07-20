import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(__dirname, "../../../..");
export const TEMPLATES_ROOT = path.resolve(__dirname, "../../templates");
export const WEB_MODULES_ROOT = path.join(REPO_ROOT, "apps/web/src/modules");
export const UI_COMPONENTS_ROOT = path.join(REPO_ROOT, "packages/ui/src/components");
