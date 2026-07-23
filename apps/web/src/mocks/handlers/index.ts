import { authHandlers } from "./auth";
import { healthHandlers } from "./health";
import { organizationHandlers } from "./organization";

export const handlers = [...healthHandlers, ...organizationHandlers, ...authHandlers];
