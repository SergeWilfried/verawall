export const kpiDefs = [
  { label: 'Active high-risk sessions', value: '23', delta: '+5', up: true, sub: 'vs. previous hour' },
  { label: 'Fraud stopped — 30 days', value: '$1.24M', delta: '+12%', up: true, sub: 'value of blocked transactions' },
  { label: 'False positive rate', value: '0.8%', delta: '−0.3', up: false, sub: 'threshold tuning' },
  { label: 'Mule accounts flagged', value: '41', delta: '+9', up: true, sub: 'pending investigation' },
];

export const weekData = [
  { label: 'W-7', v: 0.6 }, { label: 'W-6', v: 0.9 }, { label: 'W-5', v: 0.7 }, { label: 'W-4', v: 1.3 },
  { label: 'W-3', v: 1.1 }, { label: 'W-2', v: 1.6 }, { label: 'W-1', v: 1.5 }, { label: 'Now', v: 1.9 },
];

export const activityDefs = [
  { kind: 'alert', what: 'Payment held', detail: '— 240,000 Kč, coached session (M. Novak)', when: '9 min ago' },
  { kind: 'intel', what: 'Payee intel match', detail: '— confirmed fraud destination seen in traffic', when: '35 min ago' },
  { kind: 'case', what: 'Case C-1041 escalated', detail: 'to senior review', when: '1h ago' },
  { kind: 'ok', what: 'False positive closed', detail: '— C-1029 released, no loss', when: '2h ago' },
  { kind: 'alert', what: 'AML case auto-opened', detail: '— confirmed fraud, outbound flow traced', when: '2h ago' },
] as const;

export const activityColors: Record<string, string> = {
  alert: '#D71A28', case: '#E67E22', intel: '#2C7BB6', ok: '#2FBF71',
};

export const moduleDefs = [
  { name: 'Behavioral Intelligence', stat: '48k sessions/day', ok: true },
  { name: 'Payee intelligence', stat: '14 confirmed destinations', ok: true },
  { name: 'Action channel', stat: 'webhooks + kill switch live', ok: true },
  { name: 'AML two-files', stat: '3 cases auto-opened', ok: true },
];
