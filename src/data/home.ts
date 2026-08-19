// Home-page content. Source strings are English; FR lives in i18n/dict.ts.
// Every claim here describes what the VeraWall platform (SDKs, scoring
// engine, console) actually does. Market figures cite their source.

import type { IconKey } from './icons';

export type HeroVisual = 'phone' | 'verdict' | 'whitepaper';

export interface HeroSlide {
  kicker: string;
  title: string;
  titleAccent: string;
  body: string;
  cta: string;
  /** In-app route (hash allowed) … */
  to?: string;
  /** … or a plain href (e.g. the whitepaper PDF). */
  href?: string;
  visual: HeroVisual;
}

export const heroSlides: HeroSlide[] = [
  {
    kicker: 'Behavioral intelligence',
    title: 'Stop coached scams',
    titleAccent: 'before the transfer.',
    body:
      'The right customer, on the right phone, making the wrong payment. VeraWall reads the session — an active call, a screen being shared, a payee added seconds ago — and scores each payment in real time.',
    cta: 'See how it works →',
    to: '/#platform',
    visual: 'phone',
  },
  {
    kicker: 'Mobile money & instant rails',
    title: 'Built for the way',
    titleAccent: 'money moves here.',
    body:
      'Account-drain bursts, SIM-swap takeovers, agent commission fraud and mule cash-outs — detected on the devices and rails of mobile-first banking, tuned per tenant and per currency.',
    cta: 'Explore the solutions →',
    to: '/#solutions',
    visual: 'verdict',
  },
  {
    kicker: 'Whitepaper',
    title: 'Stopping fraud',
    titleAccent: 'before money moves',
    body:
      'Why SIM-swap takeovers, coached transfers and agent fraud defeat rule-based controls — and what a session-native defense looks like.',
    cta: 'Download the whitepaper (FR) →',
    href: '/Verawall-Livre-Blanc-FR.pdf',
    visual: 'whitepaper',
  },
];

export interface ServiceCard {
  icon: IconKey;
  title: string;
  desc: string;
  to?: string;
}

export const services: ServiceCard[] = [
  {
    icon: 'scam',
    title: 'Scams & Social Engineering',
    desc:
      'Coached transfers betray themselves in the session: an active call, hands-free audio, a screen being shared, a payee added and paid within seconds. VeraWall raises the anti-scam warning in-app and holds the payment.',
    to: '/solutions/app-scams',
  },
  {
    icon: 'ato',
    title: 'Account Takeover',
    desc:
      'New install, unknown device, SIM changed, remote-access tool on screen, robotic input. Known-device history and integrity signals separate the owner from the imposter — before the first transfer.',
    to: '/solutions/account-takeover',
  },
  {
    icon: 'phishing',
    title: 'Credential Theft & SIM Swap',
    desc:
      "A stolen PIN passes the login; the stranger typing it doesn't. Keystroke cadence, paste detection, SIM-change telemetry and device novelty expose the imposter at first use.",
    to: '/solutions/credential-theft',
  },
  {
    icon: 'mule',
    title: 'Money Mules & Account Drain',
    desc:
      'Rapid in-out flows, fan-out to many counterparties and bursts of transfers are scored on the ledger and in the session — with a follow-the-money graph for the analyst.',
    to: '/solutions/money-mules',
  },
  {
    icon: 'naf',
    title: 'Agent Commission Fraud',
    desc:
      'Split transactions routed through one counterparty to farm commissions — a mobile-money typology scored directly from your transaction feed, no app integration required.',
    to: '/solutions/agent-fraud',
  },
  {
    icon: 'tra',
    title: 'Transaction Risk Analysis',
    desc:
      "Every payment scored 0–100 against the session and the customer's own history: approve silently, step up, or hold — with thresholds per tenant and per currency.",
    to: '/solutions/transaction-risk',
  },
];

export const features = [
  {
    n: '01',
    icon: 'sdk' as IconKey,
    title: 'Capture on the device',
    desc:
      'Native SDKs for Android, iOS / React Native and web collect touch and typing dynamics, call state, screen-share and remote-access tells, device integrity and location — timing and geometry only, never content.',
  },
  {
    n: '02',
    icon: 'score' as IconKey,
    title: 'Score in real time',
    desc:
      'Your backend calls /v1/score with the session token. Behavioral, device and ledger signals combine into a 0–100 score, a threat type and a recommended intervention — in milliseconds.',
  },
  {
    n: '03',
    icon: 'shield' as IconKey,
    title: 'Instant Action',
    desc:
      "ALLOW, STEP_UP or HOLD. A coached victim gets an anti-scam warning instead of an OTP they would pass; an imposter gets an identity challenge; high risk is held for review.",
  },
  {
    n: '04',
    icon: 'console' as IconKey,
    title: 'Contain and investigate',
    desc:
      'Analysts release or block payments, terminate the session on the device, open cases and follow the money across counterparties — and a confirmed fraud auto-opens its AML file.',
  },
];

/** GSMA, Mobile money fraud typologies and mitigation strategies, March 2024
 *  (survey of mobile-money providers across 34 countries). */
export const marketStats = [
  { value: '$1.06M', label: 'average annual fraud loss per mobile-money provider.' },
  { value: '10%', label: 'of providers use AI or machine learning in fraud management — the rest run on rules.' },
  { value: '96%', label: 'of fraud is detected through a customer complaint, not by the system.' },
  { value: '78%', label: 'of cases see little or no recovery once the money has moved.' },
];
export const marketStatsSource = 'Source: GSMA, Mobile money fraud typologies and mitigation strategies, 2024 — 34 countries in Africa, Asia and Latin America.';

export const trustPoints: { icon: IconKey; title: string; desc: string }[] = [
  { icon: 'hash', title: 'Pseudonymous by design', desc: 'Customer and payee identifiers are hashed on the device before they reach VeraWall.' },
  { icon: 'lock', title: 'Timing, never content', desc: 'Keystroke and touch capture record cadence and geometry — no characters, no screen content.' },
  { icon: 'key', title: 'Keys encrypted at rest', desc: 'Per-tenant signing keys are versioned, envelope-encrypted and rotate without downtime.' },
  { icon: 'shield', title: 'Your tenant, your data', desc: 'Every record is scoped to your tenant; analysts authenticate with roles, MFA and revocable sessions.' },
];

export const scoreExample = `POST /v1/score
{
  "sessionToken": "…",
  "transaction": { "txnRef": "T-88213", "amount": 90000,
                   "currency": "XOF", "payeeIsNew": true }
}

→ 200 OK
{
  "decision": "STEP_UP",
  "riskScore": 72,
  "threatType": "APP Scam",
  "intervention": "SCAM_WARNING",
  "signals": [
    { "code": "ACTIVE_CALL",          "weight": 35,
      "evidence": "VoIP call, speaker on" },
    { "code": "RUSHED_NEW_PAYEE",     "weight": 20,
      "evidence": "payee added 40s before transfer" },
    { "code": "AMOUNT_ABOVE_PROFILE", "weight": 17,
      "evidence": "90000 vs. median 5000" }
  ]
}`;
