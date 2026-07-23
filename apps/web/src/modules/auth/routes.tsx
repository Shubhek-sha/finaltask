import { lazy } from "react";

const LoginPage = lazy(() => import("./LoginPage").then((m) => ({ default: m.LoginPage })));

export const authRoutes = [
  {
    path: "login",
    Component: LoginPage,
  },
];
