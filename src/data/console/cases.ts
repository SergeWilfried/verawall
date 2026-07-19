import type { ThreatType } from './types';

export type CaseStatus = 'Investigating' | 'Escalated' | 'Pending' | 'Closed';

export interface CaseRecord {
  id: string;
  user: string;
  account: string;
  type: ThreatType;
  status: CaseStatus;
  assignee: string;
  age: string;
  summary: string;
  timeline: { event: string; when: string }[];
}

export const caseDefs: CaseRecord[] = [
  {
    id: 'C-1042', user: 'M. Novak', account: 'CZ89 •• 4412', type: 'APP Scam', status: 'Investigating', assignee: 'P. Hruba', age: '2h',
    summary: 'Customer likely being coached over the phone during a payment session. Two transfers held; awaiting customer callback verification.',
    timeline: [
      { event: 'Alert raised — coached session pattern', when: 'Today 09:14' },
      { event: 'Payments CZK 240,000 held', when: 'Today 09:15' },
      { event: 'Case assigned to P. Hruba', when: 'Today 09:22' },
      { event: 'Customer callback scheduled', when: 'Today 10:05' },
    ],
  },
  {
    id: 'C-1041', user: 'K. Svoboda', account: 'CZ12 •• 8830', type: 'Account Takeover', status: 'Escalated', assignee: 'CFFC', age: '5h',
    summary: 'Remote access tool detected on a new device. Session terminated, credentials reset. Escalated to CFFC for infrastructure attribution.',
    timeline: [
      { event: 'Remote access signature match', when: 'Today 06:02' },
      { event: 'Session terminated automatically', when: 'Today 06:02' },
      { event: 'Credentials reset, customer notified', when: 'Today 06:40' },
      { event: 'Escalated to Fusion Center', when: 'Today 07:15' },
    ],
  },
  {
    id: 'C-1038', user: 'J. Dvorak', account: 'CZ44 •• 1097', type: 'Money Mule', status: 'Investigating', assignee: 'T. Marek', age: '1d',
    summary: 'Dormant account reactivated with rapid in-out transfer pattern across three counterparties. Linked to two other flagged accounts.',
    timeline: [
      { event: 'Mule pattern detected', when: 'Yesterday 14:30' },
      { event: 'Account link analysis run', when: 'Yesterday 15:10' },
      { event: 'Outbound transfers restricted', when: 'Yesterday 15:12' },
      { event: 'SAR draft prepared', when: 'Today 08:00' },
    ],
  },
  {
    id: 'C-1035', user: 'A. Prochazka', account: 'CZ71 •• 5521', type: 'Phishing', status: 'Pending', assignee: 'Unassigned', age: '1d',
    summary: 'Login from infrastructure tied to an active phishing campaign. Credentials rotated; monitoring for repeat access attempts.',
    timeline: [
      { event: 'Phishing infrastructure match', when: 'Yesterday 11:48' },
      { event: 'Step-up authentication forced', when: 'Yesterday 11:49' },
      { event: 'Credentials rotated', when: 'Yesterday 12:30' },
    ],
  },
  {
    id: 'C-1031', user: 'L. Cerny', account: 'CZ03 •• 7742', type: 'New Account Fraud', status: 'Closed', assignee: 'P. Hruba', age: '3d',
    summary: 'Onboarding biometrics inconsistent with declared identity. Account rejected at KYC review; identity flagged in FraudIntel.',
    timeline: [
      { event: 'Biometric mismatch at onboarding', when: 'Mon 10:20' },
      { event: 'KYC manual review', when: 'Mon 13:00' },
      { event: 'Application rejected', when: 'Mon 16:45' },
      { event: 'Case closed — confirmed fraud', when: 'Tue 09:00' },
    ],
  },
  {
    id: 'C-1029', user: 'E. Vesela', account: 'CZ58 •• 2318', type: 'APP Scam', status: 'Closed', assignee: 'T. Marek', age: '4d',
    summary: 'First-time payee with unusual amount. Customer confirmed legitimate invoice payment after callback; released with no loss.',
    timeline: [
      { event: 'Alert raised — payee anomaly', when: 'Sun 15:22' },
      { event: 'Payment held', when: 'Sun 15:22' },
      { event: 'Customer confirmed legitimate', when: 'Sun 16:40' },
      { event: 'Case closed — false positive', when: 'Sun 16:45' },
    ],
  },
];

export const statusColors: Record<CaseStatus, string> = {
  Investigating: '#E67E22', Escalated: '#D71A28', Pending: '#2C7BB6', Closed: '#2FBF71',
};
