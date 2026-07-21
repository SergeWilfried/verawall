# WHITEPAPER — Verawall

# Stopping Fraud Before the Money Moves
## Behavioral intelligence for mobile-first banking in Africa

*Why SIM-swap takeovers, coached transfers and agent fraud defeat rule-based controls — and what a session-native defense looks like.*

---

> **Layout notes for designer:** Verawall red `#D71A28` on dark cover; Barlow condensed headings; `[PULL QUOTE]` blocks as red callout bars; `[DIAGRAM]` blocks are specified at the end of this file. Footer: © Verawall 2026 · verawall.com

---

## Contents

1. Executive summary
2. Why fraud is winning on mobile rails
3. The Verawall approach: score the session, not just the transaction
4. Use-case spotlight: disrupting a SIM-swap takeover, end to end
5. From fraud case to AML file: the two-files doctrine
6. The business impact
7. A practical adoption path

---

## Foreword

Fraud in African digital finance is not an edge case of global fraud. It has its own shape: the phone number *is* the account, cash enters and leaves through human agent networks, and instant rails make every mistake irreversible in seconds. Defenses imported from card-fraud playbooks were never built for this.

Verawall was. We build behavioral intelligence for the way money actually moves here — on entry-level Android devices, over mobile-money rails, in French and English, under regulators who increasingly expect the fraud file and the laundering file to be connected.

This paper explains where rule-based defenses break, what a session-native defense looks like, and how one platform can take an institution from the first suspicious touch on a screen to a regulator-ready money-laundering file — automatically.

---

## 1. Executive summary

Digital fraud against African banks, fintechs and mobile-money operators is professionalizing faster than the defenses deployed against it. GSMA's 2024 survey across 34 countries puts a number on it: the average provider loses **$1.06 million a year** to mobile-money fraud, and **84% of providers say it is still increasing.** Three structural facts drive the gap:

- **Identity lives in the SIM.** Where the phone number is the account and the recovery channel, a SIM swap is a master key — cited as a prevalent scheme by **79% of providers** (GSMA, 2024).
- **Money moves instantly and irreversibly.** Wallet-to-wallet and instant transfers settle in seconds; by the time a rule fires on yesterday's batch, the funds have crossed two mule hops and left through a cash-out agent. And once they move, **78% of cases see little-to-no recovery** (GSMA, 2024).
- **The victim often authorizes the fraud.** Coached transfers — a scammer on a voice call walking the customer through the payment — look legitimate to every system that only inspects the transaction. Social-engineering schemes are cited by **88% of providers** (GSMA, 2024).

Rule-based engines inspect transactions. But in each scenario above, the tell is not in the transaction — it is in the **session**: the unfamiliar typing cadence after a SIM change, the phone call active while a transfer is keyed in, the screen-sharing app mirroring the display, the GPS position that is faked or physically impossible. Yet **only 10% of providers use AI or machine learning** in fraud management, and **96% of fraud is caught by a customer complaint** — after the money is gone (GSMA, 2024).

Verawall's Behavioral Intelligence Platform is that missing 10%. It scores the session in real time, decides **ALLOW / STEP-UP / HOLD** before funds move — not after a customer complains — gives analysts a console built for thin teams, and, uniquely, treats confirmed fraud as the *beginning* of the compliance story, auto-opening the money-laundering file and tracing the proceeds the moment an analyst confirms the fraud.

---

## 2. Why fraud is winning on mobile rails

### The SIM is the perimeter — and it is porous

Account takeover in mobile-first markets rarely starts with malware. It starts at a telecom counter, with a social-engineered SIM replacement. Once the attacker owns the number, they own the OTP channel, the recovery flow, and in many products the login itself. To a transaction rule, the attacker *is* the customer.

`[PULL QUOTE] A SIM swap defeats every control that trusts the phone number. The only thing it cannot imitate is the customer's behavior.`

### Coached payments look legitimate by design

The region's dominant scam pattern is human: a call — often in French, often over WhatsApp — from a "bank agent," a "mobile-money support line," an "investment advisor." The customer logs in from their own device, from their usual location, and sends the money themselves. Authorized-push-payment fraud is invisible to controls that ask *"is this transaction unusual?"* instead of *"is this customer being manipulated right now?"*

### Agent networks add a fraud surface banks don't model

Cash-in/cash-out agent networks are the region's superpower and its blind spot. Commission structures invite gaming — deposits split into bursts of sub-threshold transactions, near-identical amounts, one counterparty. It is a pure ledger pattern, endemic, and almost never covered by imported fraud tooling. GSMA ranks commission (arbitrage) fraud the **top agent-fraud scheme at 84%** — and most fraud isn't a lone actor: **94% of cases involve collusion between internal and external parties** (GSMA, 2024).

### Remote-access and device fraud are arriving fast

Screen-sharing "support" scams, overlay malware and scripted input — mature in other markets — are migrating to mobile-first finance. Device farms with faked GPS harvest signup bonuses at scale. Defenses that never look at the device or the input stream cannot see any of it.

### The compliance gap: one file where there should be two

When fraud proceeds move, a second obligation begins: the movement of stolen funds is **money laundering**, and FATF-aligned frameworks expect an AML investigation and, above thresholds, an STR. In practice, most institutions close the fraud case and never open the AML file — the two teams run on different systems with no bridge. Criminal networks read a closed fraud case with untraced proceeds as an open corridor.

---

## 3. The Verawall approach: score the session, not just the transaction

Verawall's platform is built on one principle: **by the time the transaction exists, most of the evidence already does.** The platform collects that evidence passively, scores it in real time, and acts before settlement.

### Pillar 1 — Behavioral capture where your customers actually are

A lightweight SDK for Android — built for the entry-level devices that dominate the region — and a drop-in web SDK capture privacy-preserving behavioral signals:

- **Input dynamics:** typing cadence, touch and mouse strokes — timing and geometry only, never content. Each customer's own history is the baseline.
- **Session context:** SIM-change telemetry, device integrity (root, hooking, emulators), headless-browser detection on web.
- **Manipulation indicators:** an active voice call during a transfer; screen-sharing or remote-control tooling; overlay-obscured touches; robotic, scripted input.
- **Location integrity:** coarse, geohash-only location with a mock-GPS flag — so spoofing "home" raises an alarm instead of silencing one — plus impossible-travel detection.

Privacy is structural: identifiers are hashed before they leave the device, location never leaves as raw coordinates, and keystroke *content* is never captured. `[Callout: GDPR-aligned; designed for BCEAO/national data-protection review]`

### Pillar 2 — Ledger detection for the frauds that live in the books

Some typologies never show up in a session. The platform ingests the transaction feed and runs detectors for money-mule flow patterns (rapid in-out, fan-out, dormant reactivation) and **agent commission fraud** — the split-deposit burst pattern — natively, not as an afterthought.

### Pillar 3 — Real-time decisioning your backend can trust

One API call at the moment of risk returns **ALLOW / STEP-UP / HOLD** with a 0–100 score and named, human-readable reasons. Decisions are idempotent — a retried call can never create a duplicate case — and every decision is explainable to an analyst, an auditor, or a regulator: *"+35 active call during transfer, +25 amount far above learned profile, +25 new device."* The action channel pushes analyst decisions back into your core banking — block payment, terminate session, kill the mobile session on-device — over signed, at-least-once webhooks.

### Pillar 4 — A console built for a five-person fraud team

Alert queue ranked by risk, one-screen alert review with the session timeline and replay, case management, and link analysis — the follow-the-money graph that walks proceeds through the mule layer and connects accounts sharing a device. Role-based access, MFA, and invitation-based onboarding are built in. Subjects appear as stable pseudonyms — analysts work cases without ever seeing raw customer identifiers.

`[DIAGRAM 1: The session-to-decision pipeline — see spec at end]`

---

## 4. Use-case spotlight: disrupting a SIM-swap takeover, end to end

**The threat.** An attacker social-engineers a SIM replacement for a mid-balance customer, receives the OTP, and logs in from a new device. Everything the login system checks — number, OTP, password — checks out.

**Stage 1 — The session betrays the attacker.** From the first screen, the platform is comparing: typing cadence against the customer's learned profile (*mismatch*), device against known installs (*first seen*), SIM state (*changed since last session*). If the attacker spoofs GPS to the victim's neighborhood, the mock-location flag fires — the evasion itself becomes evidence.

**Stage 2 — The transfer is held before settlement.** The attacker keys a transfer near the account maximum to a new payee. The score call returns **HOLD** — the stacked signals put it far over threshold — and the payment parks pending review. On instant rails, this is the only moment that matters: *before* settlement.

**Stage 3 — The analyst sees the whole story at once.** One alert: the timeline (SIM change → new device → alien typing → max-value transfer to new payee), each signal with its weight and evidence. One click terminates the session on-device and blocks the payment through the action channel.

**Stage 4 — The network, not just the case.** The link-analysis graph seeds from the subject: had anything settled, the outbound flows walk to the mule layer; the shared-device view exposes sibling accounts run from the same handset. The fraud stops being an incident and becomes a map.

`[PULL QUOTE] The transaction looked perfect. The session never did.`

**Secondary spotlights** *(one page each, same Threat / How it's caught / Outcome format):*
- **The coached transfer:** active-call detection + hesitation and correction patterns + first-time payee at an amount far above profile → STEP-UP or HOLD *while the scammer is still on the line*.
- **Agent commission fraud:** ledger detector flags the sub-threshold burst with near-identical amounts to one counterparty; the alert lands with the burst visualized — a revenue leak no imported tool covers.

---

## 5. From fraud case to AML file: the two-files doctrine

Every proceeds-capturing fraud is two compliance events: the fraud, and the laundering of what moved. Most institutions handle the first and never open the second — not from negligence, but because no system bridges them.

Verawall closes the gap structurally. When an analyst resolves an alert as **confirmed fraud**, the platform checks whether funds actually moved after the compromise. If they did, it **auto-opens a linked AML case** — pre-populated with the traced outbound flows, tied to the fraud case, exactly once per alert — and links it to the money-flow graph. If nothing moved, no file opens: triage is built in, so case volume stays sane.

The analyst's next questions are already framed: who is the mule layer, does the total meet the STR threshold, which other accounts touch the same counterparties or devices.

`[PULL QUOTE] When your institution closes a SIM-swap fraud case, does an AML investigation into the fund flows ever open? With Verawall, it opens itself — with the money already traced.`

---

## 6. The business impact

- **Losses stop before settlement.** HOLD happens pre-settlement; on instant rails that is the difference between a prevented loss and a write-off. Step-up handles the grey zone without blanket friction.
- **Thin teams do deep work.** Ranked queues, one-screen review with evidence attached, and one-click actions mean a handful of analysts covers what used to need a department. The alert says *why* in plain language — no model archaeology.
- **Compliance posture improves by default.** The AML file exists, the flow trace exists, the audit trail exists — because the system created them. STR preparation starts from a populated case, not a blank page.
- **Customers keep their trust.** Customers are the party **most severely impacted** by mobile-money fraud (GSMA, 2024). In markets where trust in digital finance is still being won, the difference between "the bank stopped it" and "the bank refunded me eventually" is retention — especially when recovery, industry-wide, so rarely happens.
- **One platform, both surfaces.** Android and web sessions, behavioral and ledger typologies, fraud and AML — one data model, one console, one integration.

`[Optional sidebar: honest scoping — behavioral baselines need a learning window; detector thresholds are tuned per institution during onboarding; device-level signals are strongest on Android, the region's dominant platform.]`

---

## 7. A practical adoption path

1. **Week 1 — Integrate passively.** Drop the SDK into the app (no permission changes, no UX impact) and mirror the transaction feed. The platform observes and builds baselines. Nothing customer-facing changes.
2. **Weeks 2–4 — Shadow scoring.** Your backend calls the score API but enforces nothing. You watch the console fill with what the platform *would* have held, and thresholds are tuned to your book, your amounts, your customers.
3. **Week 5+ — Enforce gradually.** Turn on STEP-UP for the grey zone first, then HOLD for the highest band. The kill-switch and payment-block channel go live with analyst control.
4. **Ongoing — Expand coverage.** Add the web SDK where you have a web channel, enable the AML bridge for your compliance team, and light up link analysis as your ledger history deepens.

Integration is deliberately small: one SDK, one feed, one API call at the moment of risk. A design-partner deployment reaches shadow scoring within a month.

---

**Verawall — Behavioral Intelligence for Fraud Prevention**
*Built for mobile-first finance. © Verawall 2026 · verawall.com · contact@verawall.com*

---

## Appendix: diagram specs for design

**DIAGRAM 1 — Session-to-decision pipeline (section 3).** Horizontal flow, five stages: `Customer session (app / web)` → `Passive behavioral capture` → `Real-time scoring engine (learned baselines + typology signals)` → `Decision: ALLOW / STEP-UP / HOLD` → `Analyst console + action channel (block · terminate · AML file)`. Verawall red accents on the decision stage; grey line-art style consistent with console empty-state illustrations.

**DIAGRAM 2 — Fraud lifecycle, regionalized (optional, section 2).** Circular five-stage cycle: `1. Number takeover (SIM swap / social engineering)` → `2. Account entry (looks legitimate)` → `3. Extraction (instant transfer)` → `4. Mule layer (wallet hops)` → `5. Cash-out (agent network)` — with Verawall intervention points marked at stages 2, 3 and 4.

**DIAGRAM 3 — Two-files doctrine (section 5).** Left card `FRAUD FILE — alert, session evidence, disposition`; arrow labeled `funds moved?`; right card `AML FILE — auto-opened, flow trace, STR prep`; below, a small three-node money-flow graph (subject → mule → cash-out).
