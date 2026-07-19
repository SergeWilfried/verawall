# VeraWall

VeraWall is a behavioral intelligence platform for fraud prevention: a marketing site describing the product and its solutions, and the BIP (Behavioral Intelligence Platform) Console — the analyst-facing application fraud teams use to monitor alerts, investigate sessions, manage cases, and tune risk policy in real time.

This repo is a Vite + React + TypeScript application covering both surfaces, routed with `react-router-dom`.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck (tsc -b) + production build
npm run lint     # oxlint
npm run preview  # preview the production build
```

## Structure

```
src/
  App.tsx              # route table — splits marketing vs. console layouts
  theme.ts              # shared color/font constants
  i18n/                 # EN/FR language context + dictionary (marketing site)
  components/           # marketing site: Header, Footer, RedCta, StatsGrid, CardsGrid, ...
  pages/                # marketing site pages: Home, SolutionDetail, InstantPaymentScams
  console/
    ConsoleLayout.tsx   # sidebar + topbar shell for /console/*
    TitleContext.tsx    # lets a page set the topbar title
    graphLayout.ts       # layout math for the transaction graph (radial node placement)
    usePagination.ts     # shared table-pagination hook
    components/          # console UI: Chip, ScoreBadge, TabButton, Toggle, Pagination, GraphSvg, TagBadge
    pages/                # one file per console screen (see Routes below)
  data/
    console/              # typed content for the console (alerts, cases, detections, graph, settings, ...)
    home.ts, solutionPages.ts, instantPayment.ts, nav.ts  # marketing site copy/content
legacy/                  # earlier static build of the site, kept for reference only
```

## Routes

**Marketing site** (`Header`/`Footer` layout):
- `/` — Home
- `/solutions/:slug` — Solution detail pages (APP scams, account takeover, transaction risk, etc.)
- `/instant-payment-scams` — standalone solution page

**Console** (`/console/*`, dark sidebar + topbar layout):
- `/console/login` — analyst sign-in; `/console/*` routes are session-gated (demo: any Team & Roles email + 8-char password, session in localStorage)
- `/console/invite?token=…` — invitation acceptance in two steps: name + password, then mandatory two-factor enrollment (real TOTP: QR / manual key, verified against the authenticator via WebCrypto in `src/console/totp.ts`); handles invalid/expired links
- `/console/overview` — KPI row, fraud-prevented chart, activity feed, module health, top threats
- `/console/alerts` — alert queue with filters, pagination, behavioral signals, threat mix
- `/console/alerts/:alertId` — alert review: session timeline, session replay, transaction release/block, disposition
- `/console/customers/:name` — customer risk profile
- `/console/detections` — detection-type breakdown, links into the filtered alert queue
- `/console/transaction-risk` — live payment stream (paginated) + auth-outcome/policy stats tabs
- `/console/cases` — case list (filterable, paginated) with a detail/timeline panel
- `/console/graph` — link-analysis graph with expandable nodes
- `/console/settings` — tenant, notifications, API keys, modules, integrations, team (sectioned nav); Team & Roles includes admin-gated analyst invitations (send, copy link, resend, revoke)

Sidebar nav items without a route are intentionally rendered as disabled labels rather than dead links.

## Running against the Go server

The console's authenticated surfaces (auth, alerts, cases, overview,
customer profiles, team & invitations) run against the Go ingest server
(`../vera-tools/fraud-ingest-server-go`) via `src/console/api.ts`. The
base URL is `VITE_API_BASE` (`.env.development`, default
`http://localhost:8080`).

```bash
# 1. start the Go server (Postgres vera_fraud)
cd ../vera-tools/fraud-ingest-server-go && go run . &
# 2. seed demo alerts/cases/ledger by running the conformance suite once
node ../fraud-ingest-server/simulate-sdk.js all http://localhost:8080
# 3. start the console and sign in as the bootstrap admin
cd ../../verawall && npm run dev
#    admin@demobank.cz / admin-dev-password
```

Analyst invitations (Team & Roles) and the two-factor enrollment on the
invitation link verify against the server's real TOTP; role gating in
the UI mirrors the server's RBAC (analysts can dispose alerts but not run
the action channel or manage the team).

Live pages (Go server): Overview KPIs + activity feed + top threats,
Alert Queue, Alert Review, Case Management, Customer Profile, Detections
(alert counts by threat type), Transaction Risk (decision stream +
auth-outcome mix), Team & Roles. Still demo: the Overview 8-week chart
(no time-series in a fresh platform — labelled "demo data") and platform
modules panel, Transaction Graph, FraudIntel, ScamFlag, and the non-team
Platform Settings sections (tenant, notifications, API keys, modules,
integrations).

## Notes

- Demo content for the still-mocked pages lives in `src/data/console/*.ts`.
- `src/console/api.ts` is the single API client (base URL, bearer token,
  401 handling, server↔display role mapping); `src/console/auth.tsx` holds
  the session against `POST /v1/console/login` + `GET /v1/console/me`.
- Images/icons are still hotlinked from a third-party asset host — a known carryover worth migrating to owned assets.
- `legacy/` is reference-only and isn't built or imported by the app.
