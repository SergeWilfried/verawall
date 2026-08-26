// Risk-policy presets: vertical × appetite → concrete knob values.
//
// Pure data, deliberately — adding a vertical is content, not code. The
// wizard shows the resulting numbers before applying (no magic), and every
// application lands in the audit trail via the settings dispatcher.
//
// Split of responsibilities:
//   - the VERTICAL knows transaction shape → velocity knobs (counts/minutes,
//     currency-free, so presets are safe across XOF and CZK tenants alike);
//   - the APPETITE knows tolerance → policy bands, plus a multiplier applied
//     to the tenant's CURRENT high-amount cutoffs (presets cannot know what
//     "high" means in a given currency; the tenant's existing cutoffs do).

export interface RiskAppetite {
  key: 'conservative' | 'balanced' | 'aggressive';
  label: string;
  /** Stated as a consequence, not an adjective. */
  consequence: string;
  bands: { stepUp: number; hold: number };
  highAmountFactor: number;
}

export interface RiskVertical {
  key: string;
  label: string;
  desc: string;
  /** What this vertical's preset actually tunes for. */
  focus: string;
  velocity: { windowMin: number; threshold: number; baseWeight: number; slope: number };
}

export const appetites: RiskAppetite[] = [
  {
    key: 'conservative',
    label: 'Conservative',
    consequence: 'More customers challenged, less fraud through — payments start holding at score 70.',
    bands: { stepUp: 45, hold: 70 },
    highAmountFactor: 0.7,
  },
  {
    key: 'balanced',
    label: 'Balanced',
    consequence: 'The platform defaults — step-up from 55, hold from 85.',
    bands: { stepUp: 55, hold: 85 },
    highAmountFactor: 1,
  },
  {
    key: 'aggressive',
    label: 'Growth-first',
    consequence: 'Fewer challenges, more risk tolerated — only score 92+ holds; step-up from 65.',
    bands: { stepUp: 65, hold: 92 },
    highAmountFactor: 1.5,
  },
];

export const verticals: RiskVertical[] = [
  {
    key: 'microfinance',
    label: 'Microfinance',
    desc: 'Group lending, agent networks, frequent small disbursements.',
    focus: 'Tighter transfer velocity — agent commission fraud splits deposits into sub-threshold bursts.',
    velocity: { windowMin: 10, threshold: 3, baseWeight: 25, slope: 15 },
  },
  {
    key: 'wallet',
    label: 'Mobile money / wallet',
    desc: 'P2P transfers, merchant payments, cash-in/cash-out.',
    focus: 'P2P bursts are normal here — velocity fires later but escalates; payee intelligence carries more of the load.',
    velocity: { windowMin: 10, threshold: 5, baseWeight: 20, slope: 12 },
  },
  {
    key: 'ridesharing',
    label: 'Ridesharing / gig payouts',
    desc: 'Driver and courier payouts, many small legitimate transactions.',
    focus: 'Bursty legitimate payouts — velocity is the loosest; device integrity and cloned-app signals matter most.',
    velocity: { windowMin: 10, threshold: 6, baseWeight: 15, slope: 10 },
  },
  {
    key: 'bank',
    label: 'Retail bank',
    desc: 'Current accounts, standing transfers, bill payments.',
    focus: 'The platform baseline — transfer velocity at its defaults, all signal families weighted evenly.',
    velocity: { windowMin: 10, threshold: 4, baseWeight: 20, slope: 15 },
  },
];

/** Scale a high-amount cutoff map by the appetite factor, rounded to two
 *  significant digits so the numbers stay presentable. */
export function scaleHighAmount(current: Record<string, number>, factor: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [ccy, v] of Object.entries(current)) {
    const scaled = v * factor;
    const mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(scaled)) - 1));
    out[ccy] = Math.round(scaled / mag) * mag;
  }
  return out;
}
