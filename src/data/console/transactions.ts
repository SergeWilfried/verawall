export interface Txn {
  score: number;
  payer: string;
  payee: string;
  context: string;
  amount: string;
  decision: 'Held' | 'Step-up' | 'Approved' | 'Blocked' | 'Released';
  status: 'pending' | 'auto';
}

export const txnDefs: Txn[] = [
  { score: 92, payer: 'M. Novak', payee: 'CZ55 •• 0930 (new payee)', context: 'First-time payee, coached session active', amount: '240,000 Kč', decision: 'Held', status: 'pending' },
  { score: 88, payer: 'E. Vesela', payee: 'Crypto exchange — Kraken', context: 'Unusual amount, investment-scam pattern', amount: '€4,800', decision: 'Held', status: 'pending' },
  { score: 71, payer: 'D. Kolar', payee: 'PL07 •• 2214 (cross-border)', context: 'New device, amount above profile', amount: '89,500 Kč', decision: 'Step-up', status: 'auto' },
  { score: 64, payer: 'R. Blaha', payee: 'Card payment — 3DS', context: '3D Secure challenge triggered', amount: '12,300 Kč', decision: 'Step-up', status: 'auto' },
  { score: 22, payer: 'S. Urbanova', payee: 'ČEZ — utility invoice', context: 'Regular payee, profile match', amount: '1,240 Kč', decision: 'Approved', status: 'auto' },
  { score: 14, payer: 'V. Fiala', payee: 'Rohlik.cz — groceries', context: 'Recurring merchant, invisible auth', amount: '2,180 Kč', decision: 'Approved', status: 'auto' },
  { score: 9, payer: 'H. Prokopova', payee: 'T-Mobile — monthly bill', context: 'Standing order, profile match', amount: '799 Kč', decision: 'Approved', status: 'auto' },
];

export const decisionColors: Record<string, string> = {
  Held: '#D71A28', 'Step-up': '#E67E22', Approved: '#2FBF71', Blocked: '#B8121F', Released: '#2FBF71',
};

export function txnScoreColor(score: number) {
  return score >= 85 ? '#D71A28' : score >= 55 ? '#E67E22' : '#2FBF71';
}

export const authMixDefs = [
  { name: 'Invisible (profile match)', pct: '86%', w: 86, color: '#2FBF71' },
  { name: '3DS / step-up challenge', pct: '9%', w: 9, color: '#E67E22' },
  { name: 'Held for analyst review', pct: '3%', w: 3, color: '#D71A28' },
  { name: 'Blocked outright', pct: '2%', w: 2, color: '#B8121F' },
];

export const policyBands = [
  { band: 'Low risk', range: '0–54', rule: 'Approve silently — no customer friction', color: '#2FBF71' },
  { band: 'Elevated risk', range: '55–84', rule: 'Step-up: 3DS challenge or strong authentication', color: '#E67E22' },
  { band: 'High risk', range: '85–100', rule: 'Hold payment — route to analyst queue', color: '#D71A28' },
];
