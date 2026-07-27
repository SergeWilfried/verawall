import type { Alert, ThreatType } from './types';

export const alertDefs: Alert[] = [
  { score: 94, user: 'M. Novak', account: 'CZ89 •• 4412', type: 'APP Scam', signal: 'Coached session — hesitation + phone call detected' },
  { score: 91, user: 'K. Svoboda', account: 'CZ12 •• 8830', type: 'Account Takeover', signal: 'New device + remote access tool signature' },
  { score: 87, user: 'J. Dvorak', account: 'CZ44 •• 1097', type: 'Money Mule', signal: 'Rapid in-out transfers, dormant account activated' },
  { score: 76, user: 'A. Prochazka', account: 'CZ71 •• 5521', type: 'Phishing', signal: 'Credentials used from known phishing infrastructure' },
  { score: 64, user: 'L. Cerny', account: 'CZ03 •• 7742', type: 'New Account Fraud', signal: 'Typing cadence mismatch vs. declared identity age' },
  { score: 52, user: 'E. Vesela', account: 'CZ58 •• 2318', type: 'APP Scam', signal: 'First-time payee + unusual amount pattern' },
];

export const typeColors: Record<ThreatType, string> = {
  'APP Scam': '#D71A28',
  'Account Takeover': '#B8121F',
  'Money Mule': '#8E44AD',
  Phishing: '#E67E22',
  'New Account Fraud': '#2C7BB6',
  'Commission Fraud': '#16A085',
};

// Severity by policy band (55 step-up / 85 hold). Within the hold band the
// colour ramps from a warm red at 85 to a deep crimson at 100, so a queue of
// all-hold alerts still separates 85 from 100 at a glance instead of reading
// as one flat red.
export function scoreColor(score: number) {
  if (score >= 85) {
    const t = Math.min(1, Math.max(0, (score - 85) / 15));
    const a = [232, 96, 104]; // #E86068 at 85
    const b = [155, 13, 23]; //  #9B0D17 at 100
    const c = a.map((x, i) => Math.round(x + (b[i] - x) * t));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  }
  if (score >= 55) return '#E67E22'; // step-up band
  return '#95A0AC'; // allow band
}
