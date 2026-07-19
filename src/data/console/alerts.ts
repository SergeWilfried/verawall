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
};

export function scoreColor(score: number) {
  return score >= 85 ? '#D71A28' : score >= 70 ? '#E67E22' : '#95A0AC';
}
