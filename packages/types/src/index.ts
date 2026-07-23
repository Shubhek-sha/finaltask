/**
 * @forge/types — shared TypeScript types and Zod schemas.
 *
 * This package is the single source of truth for the data model (domain
 * entities, RBAC roles, API contracts, realtime event payloads) — consumed
 * by apps/web's real code AND by its MSW mock handlers, so the two can
 * never drift. Populated module-by-module starting in Phase 3 (Mock API
 * layer) — see ARCHITECTURE.md §6.
 */

export const FORGE_TYPES_VERSION = "0.0.0";

export * from "./permission";
export * from "./role";
export * from "./organization";
export * from "./user";
export * from "./auth";
