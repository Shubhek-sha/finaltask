/**
 * @forge/sdk — typed fetch client + realtime event contracts.
 *
 * Consumed only by apps/web. Wraps fetch calls (typed against @forge/types)
 * and the RealtimeBus event map (see ARCHITECTURE.md §9). Deliberately
 * unaware that the network calls terminate in MSW handlers rather than a
 * real server — see ARCHITECTURE.md §2.1.
 */

export const FORGE_SDK_VERSION = "0.0.0";

export * from "./http";
export * from "./token";
export * from "./auth";
