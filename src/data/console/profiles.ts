import type { ProfileDetail } from './types';

export const profileDefs: Record<string, ProfileDetail> = {
  'M. Novak': {
    segment: 'Retail', since: '2019', sessions: '3 / week', riskNow: 'Elevated',
    devices: [{ name: 'iPhone 15', detail: 'Primary · known 14 months · biometric unlock', ok: true }],
    baseline: [
      { k: 'Typing cadence', v: '58 wpm · stable' },
      { k: 'Usual login window', v: '07–09 h, 19–22 h' },
      { k: 'Usual locations', v: 'Brno, CZ' },
      { k: 'Typical payment range', v: '500 – 12,000 Kč' },
      { k: 'Profile confidence', v: 'High · 3 yrs of data' },
    ],
  },
  'K. Svoboda': {
    segment: 'Retail', since: '2021', sessions: '5 / week', riskNow: 'Critical',
    devices: [
      { name: 'MacBook Air', detail: 'Primary · known 2 years', ok: true },
      { name: 'Windows 11 / Chrome', detail: 'NEW · first seen today · RAT detected', ok: false },
    ],
    baseline: [
      { k: 'Typing cadence', v: '72 wpm · stable' },
      { k: 'Usual login window', v: '12–14 h, 20–23 h' },
      { k: 'Usual locations', v: 'Praha, CZ' },
      { k: 'Typical payment range', v: '800 – 25,000 Kč' },
      { k: 'Profile confidence', v: 'High · 4 yrs of data' },
    ],
  },
  'J. Dvorak': {
    segment: 'Retail', since: '2021', sessions: 'dormant 7 mo', riskNow: 'High',
    devices: [{ name: 'Android 14', detail: 'Known · reactivated after dormancy', ok: true }],
    baseline: [
      { k: 'Typing cadence', v: '44 wpm · limited data' },
      { k: 'Usual login window', v: 'irregular' },
      { k: 'Usual locations', v: 'Ostrava, CZ' },
      { k: 'Typical payment range', v: '200 – 3,000 Kč' },
      { k: 'Profile confidence', v: 'Low · dormant account' },
    ],
  },
  'A. Prochazka': {
    segment: 'Retail', since: '2018', sessions: '2 / week', riskNow: 'Contained',
    devices: [{ name: 'iPhone 13', detail: 'Primary · known 3 years', ok: true }],
    baseline: [
      { k: 'Typing cadence', v: '51 wpm · stable' },
      { k: 'Usual login window', v: '18–21 h' },
      { k: 'Usual locations', v: 'Praha, CZ' },
      { k: 'Typical payment range', v: '300 – 9,000 Kč' },
      { k: 'Profile confidence', v: 'High · 8 yrs of data' },
    ],
  },
  'L. Cerny': {
    segment: 'Onboarding', since: 'this week', sessions: '1 application', riskNow: 'High',
    devices: [{ name: 'Android 13', detail: 'NEW · seen on 2 other applications', ok: false }],
    baseline: [
      { k: 'Typing cadence', v: '94 wpm · inconsistent with declared age' },
      { k: 'Usual login window', v: 'no history' },
      { k: 'Usual locations', v: 'Praha, CZ' },
      { k: 'Typical payment range', v: 'no history' },
      { k: 'Profile confidence', v: 'None · new applicant' },
    ],
  },
  'E. Vesela': {
    segment: 'Retail', since: '2023', sessions: '4 / week', riskNow: 'Low',
    devices: [{ name: 'Samsung S24', detail: 'Primary · known 18 months', ok: true }],
    baseline: [
      { k: 'Typing cadence', v: '63 wpm · stable' },
      { k: 'Usual login window', v: '07–08 h, 21–23 h' },
      { k: 'Usual locations', v: 'Plzeň, CZ' },
      { k: 'Typical payment range', v: '400 – 8,000 Kč' },
      { k: 'Profile confidence', v: 'High · 3 yrs of data' },
    ],
  },
};

export const riskColors: Record<string, string> = {
  Critical: '#D71A28', High: '#D71A28', Elevated: '#E67E22', Contained: '#2C7BB6', Low: '#2FBF71',
};
