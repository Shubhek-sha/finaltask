import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DEMO_PASSWORD } from "../../../mocks/fixtures/credentials";
import { AuthProvider } from "../AuthProvider";
import { clearRefreshToken, saveRefreshToken } from "../token-storage";
import { RequireAuth } from "./RequireAuth";

afterEach(() => {
  clearRefreshToken();
});

function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <p>Protected content</p>
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("RequireAuth", () => {
  it("redirects to /login when there is no session", async () => {
    renderApp();
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  it("renders the protected content once a session is restored", async () => {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "ada@forge.dev", password: DEMO_PASSWORD }),
    });
    const body = await res.json();
    saveRefreshToken(body.tokens.refreshToken);

    renderApp();
    expect(await screen.findByText("Protected content")).toBeInTheDocument();
  });
});
