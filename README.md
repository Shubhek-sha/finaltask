# Forge — Design System Preview

This repo is the in-progress build of **Forge**, a workforce & project management platform.
Right now, what's actually wired up and visible in the UI is the **design system showcase page**
plus **login/auth**. This README explains what you're looking at so none of it reads as broken.
For the full technical architecture and roadmap, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 1. Running it locally

```bash
pnpm install
pnpm dev
```

This is a **frontend-only** app — there is no backend to start separately. All API calls are
intercepted in the browser by **Mock Service Worker (MSW)** and served from an in-memory,
fake database that reseeds itself every time the app loads. Nothing you do persists across a
hard refresh — that's expected, not a bug.

## 2. Logging in

You'll land on `/login`. Any of these seeded accounts work, all with the same password:

| Email | Role | Can see |
|---|---|---|
| `ada@forge.dev` | ADMIN | Everything, including the "Admin panel" card |
| `grace@forge.dev` | MANAGER | Projects/tasks, no admin panel |
| `alan@forge.dev` | EMPLOYEE | Read-only-ish view, no "New project" button, no admin panel |

**Password for all of them:** `password123`

The login form is pre-filled with the admin account, so you can just hit **Sign in**.

There are also 12 randomly generated employee accounts (same password) if you want more
variety — check the in-memory user list, they're not listed anywhere in the UI.

### What determines what you see after login

Login is driven by a state machine (not a simple boolean), so there's a brief moment on every
page load where the app is silently checking whether you have a valid session — this is normal
and typically resolves in well under a second:

```
checkingSession → authenticated (or unauthenticated → redirected to /login)
```

Once authenticated, every card/button that depends on your role is shown or hidden by a `<Can>`
permission check — e.g. only ADMIN sees the "Admin panel" card, only ADMIN/MANAGER see
"New project". If a button seems to be missing, it's very likely a permissions thing tied to
which demo account you logged in as, not a rendering bug.

## 3. What the home page actually is

After logging in, the page titled **"Forge — Design System"** is **not a feature of the
product** — it's a living catalog of every reusable UI component in `packages/ui`, so they can be
checked visually in the context of the real app styling. Section by section:

| Section | What it's showing |
|---|---|
| Header | Your logged-in user, avatar, and a sign-out button — pulled from whichever account you logged in with |
| Button row | Every button variant (primary, secondary, outline, ghost, destructive, link) side by side, **plus one button intentionally stuck in its `isLoading` state** so you can see what a loading button looks like. It spins forever on purpose — it's not tied to any real action, so don't read it as something hanging. |
| Badge row | Every badge/status-pill color |
| Avatar row | Every avatar size |
| Projects table | Static demo rows in a `Table` component — not live/editable project data yet |
| "New project" card | Opens a real modal with a real validated form (react-hook-form), but submitting it just fires a toast — it doesn't persist a project anywhere yet |
| Admin panel card | Only visible to the ADMIN account — demonstrates the permission-gating component, not a built admin feature |
| "Fire a toast" button | Manually triggers the toast/notification component so you can see it |

In short: **if something on this page looks inert or decorative, it probably is** — this page's
job is to prove the design system works, not to be the finished app.

## 4. Why things are structured this way

- **No backend, on purpose.** `fetch("/api/...")` calls are real network calls that MSW
  intercepts in the browser. Nothing about the UI code knows it isn't talking to a real server.
- **Auth tokens are real JWT-shaped tokens** (issued by a mock login handler), so the session
  logic, expiry, and refresh flow all behave like a real system would — they just aren't backed
  by a real database.
- **Refreshing the page resets the "database"** (projects, users, form data) back to the seeded
  state. This is intentional so every demo starts from the same clean slate.

## 5. What's not built yet

The full product plan (Kanban boards, dashboards, dynamic forms, notifications, reports, etc.)
is documented in [ARCHITECTURE.md](./ARCHITECTURE.md) §1 and §16. Only the design system and
auth/RBAC phases are live today — everything else in that roadmap is not yet reachable from the
UI, so don't go looking for it.

## 6. Deploying (Vercel)

This is a static SPA (no real backend), so it deploys cleanly to Vercel:

1. Import the repo into Vercel.
2. Project Settings → **Root Directory**: `apps/web` (that's where [vercel.json](apps/web/vercel.json)
   lives — it just adds the SPA rewrite so client-side routes like `/login` don't 404 on refresh).
3. Project Settings → **Node.js Version**: 22.x (matches the `engines` field in the root
   `package.json`).
4. No environment variables are required — MSW mocks the API in every environment, including
   production.

Vercel auto-detects the Vite build and the pnpm workspace from the repo-root `pnpm-lock.yaml`.

## 7. Repo layout (quick reference)

```
apps/web/          the app you're running (React + Vite)
packages/ui/        the design system components shown on the home page
packages/types/      shared TypeScript types / data model
packages/sdk/        typed API client used by the app
tools/codegen/       CLI that scaffolds new feature modules
```

For anything deeper (data model, state machines, real-time design, testing strategy), see
[ARCHITECTURE.md](./ARCHITECTURE.md).
