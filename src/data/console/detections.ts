import type { Detection } from './types';

export const detectionDefs: Detection[] = [
  { name: 'Scams & Social Engineering', type: 'APP Scam', count: 128, trend: '+18% vs. last week', desc: 'APP, instant payment, investment, romance and purchase scams — coached-session and manipulation patterns detected in real time.' },
  { name: 'Phishing & Malware', type: 'Phishing', count: 96, trend: '+6% vs. last week', desc: 'Credentials harvested via phishing infrastructure and financial malware signatures, blocked before misuse.' },
  { name: 'Account Takeover', type: 'Account Takeover', count: 74, trend: '−4% vs. last week', desc: 'Remote access attacks, session hijacking and SIM swap — unauthorized access flagged by behavioral mismatch.' },
  { name: 'Money Mules', type: 'Money Mule', count: 41, trend: '+9 new accounts', desc: 'Dormant accounts activated for rapid in-out transfers, identified before fraudsters cover their tracks.' },
  { name: 'New Account Fraud', type: 'New Account Fraud', count: 29, trend: 'stable', desc: 'Stolen or synthetic identities at onboarding — bonus abuse, bot attacks and loan fraud caught by biometrics.' },
  { name: 'Transaction Risk', type: null, count: 212, trend: '0.8% false positives', desc: 'Adaptive risk scoring of every payment — stringent measures applied only where risk demands it.' },
];

export const threatDefs = [
  { name: 'APP / Instant scams', count: 128 },
  { name: 'Phishing', count: 96 },
  { name: 'Account takeover', count: 74 },
  { name: 'Money mules', count: 41 },
  { name: 'New account fraud', count: 29 },
  { name: 'Financial malware', count: 17 },
];
