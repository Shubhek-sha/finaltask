import { http, HttpResponse } from "msw";
import { db } from "../db";

export const organizationHandlers = [
  http.get("/api/v1/organizations/current", () => {
    const organization = db.organizations.list()[0];
    if (!organization) {
      return HttpResponse.json({ message: "No organization seeded" }, { status: 404 });
    }
    return HttpResponse.json(organization);
  }),
];
