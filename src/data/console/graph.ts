export type NodeKind = 'subject' | 'safe' | 'warn' | 'mule' | 'intel';

export interface GraphNodeDef {
  id: string;
  parent?: string;
  label: string;
  sub: string;
  kind: Exclude<NodeKind, 'subject'>;
  dir: 'in' | 'out';
  amount: string;
  weight: number;
  stats?: { k: string; v: string }[];
  flags?: string[];
}

export interface GraphSubject {
  sub: string;
  stats: { k: string; v: string }[];
  flags: string[];
  nodes: GraphNodeDef[];
}

export const graphKinds: Record<NodeKind, { color: string; name: string; desc: string }> = {
  subject: { color: '#1D1D1B', name: 'Subject account', desc: 'seed of the graph' },
  safe: { color: '#2FBF71', name: 'Established counterparty', desc: 'profile match, no flags' },
  warn: { color: '#E67E22', name: 'Anomalous / victim', desc: 'unusual for profile' },
  mule: { color: '#8E44AD', name: 'Suspected mule layer', desc: 'velocity / linkage' },
  intel: { color: '#D71A28', name: 'FraudIntel match', desc: 'confirmed network flag' },
};

export const graphDefs: Record<string, GraphSubject> = {
  'M. Novak': {
    sub: 'CZ89 •• 4412 · retail customer · victim',
    stats: [
      { k: 'Held right now', v: '240,000 Kč' },
      { k: 'Outbound 30 days', v: '312,000 Kč' },
      { k: 'Risk score', v: '94 — APP Scam' },
    ],
    flags: ['Coached session active — payment held pending callback'],
    nodes: [
      {
        id: 'mule1', label: 'CZ55 •• 0930', sub: 'new payee · 3 wks old', kind: 'intel', dir: 'out', amount: '240k Kč held', weight: 3,
        stats: [
          { k: 'Inbound 7 days', v: '612,000 Kč · 3 victims' },
          { k: 'Outbound 7 days', v: '590,000 Kč in minutes' },
          { k: 'Account age', v: '3 weeks' },
        ],
        flags: ['FraudIntel match — Operation SafeAccount mule list', 'Fan-in from 2 victims at partner banks'],
      },
      { id: 'v2', parent: 'mule1', label: 'Victim B', sub: 'partner bank', kind: 'warn', dir: 'in', amount: '180k Kč', weight: 2, flags: ['Reported via FraudIntel by partner institution'] },
      { id: 'v3', parent: 'mule1', label: 'Victim C', sub: 'partner bank', kind: 'warn', dir: 'in', amount: '192k Kč', weight: 2, flags: ['Reported via FraudIntel by partner institution'] },
      { id: 'x1', parent: 'mule1', label: 'PL07 •• 2214', sub: 'cross-border', kind: 'mule', dir: 'out', amount: '310k Kč', weight: 2, flags: ['Second-layer mule — cash-out region Katowice'] },
      { id: 'x2', parent: 'mule1', label: 'Crypto exch.', sub: 'Kraken deposit', kind: 'mule', dir: 'out', amount: '280k Kč', weight: 2, flags: ['Deposit address tied to 12 prior reports'] },
      { id: 'sal', label: 'Employer s.r.o.', sub: 'salary · monthly', kind: 'safe', dir: 'in', amount: '62k Kč /mo', weight: 1 },
      { id: 'cez', label: 'ČEZ', sub: 'utility · regular', kind: 'safe', dir: 'out', amount: '1.2k Kč /mo', weight: 1 },
      { id: 'tmo', label: 'T-Mobile', sub: 'standing order', kind: 'safe', dir: 'out', amount: '799 Kč /mo', weight: 1 },
    ],
  },
  'J. Dvorak': {
    sub: 'CZ44 •• 1097 · dormant 7 mo · suspected mule',
    stats: [
      { k: 'Inbound today', v: '95,000 Kč' },
      { k: 'Outbound today', v: '93,400 Kč · 4 min' },
      { k: 'Risk score', v: '87 — Money Mule' },
    ],
    flags: ['Rapid in-out velocity — outbound restricted', 'Device fingerprint shared with 2 flagged accounts'],
    nodes: [
      {
        id: 'src', label: 'CZ31 •• 8802', sub: 'source account', kind: 'intel', dir: 'in', amount: '95k Kč', weight: 3,
        stats: [{ k: 'Linked investigations', v: '2 open' }, { k: 'Fan-in 30 days', v: '7 victims' }],
        flags: ['Flagged in two other mule investigations', 'Collects investment-scam proceeds'],
      },
      { id: 'sv1', parent: 'src', label: 'Victim D', sub: 'investment scam', kind: 'warn', dir: 'in', amount: '48k Kč', weight: 2 },
      { id: 'sv2', parent: 'src', label: 'Victim E', sub: 'romance scam', kind: 'warn', dir: 'in', amount: '47k Kč', weight: 2 },
      { id: 'c1', label: 'CZ90 •• 1174', sub: 'counterparty 1', kind: 'mule', dir: 'out', amount: '31.1k Kč', weight: 2, flags: ['Shares device fingerprint with subject'] },
      { id: 'atm', parent: 'c1', label: 'ATM cash-out', sub: 'Katowice, PL', kind: 'mule', dir: 'out', amount: '30k Kč', weight: 2, flags: ['NFC relay pattern — ghost-tap withdrawals'] },
      { id: 'c2', label: 'SK44 •• 7730', sub: 'counterparty 2', kind: 'mule', dir: 'out', amount: '31.2k Kč', weight: 2 },
      { id: 'c3', label: 'Crypto exch.', sub: 'counterparty 3', kind: 'mule', dir: 'out', amount: '31.1k Kč', weight: 2 },
    ],
  },
  'E. Vesela': {
    sub: 'CZ58 •• 2318 · retail customer · stable profile',
    stats: [
      { k: 'Held right now', v: '68,000 Kč' },
      { k: 'Typical range', v: '400 – 8,000 Kč' },
      { k: 'Risk score', v: '52 — payee anomaly' },
    ],
    flags: ['First-time payee above learned amount range — no coaching indicators'],
    nodes: [
      {
        id: 'biz', label: 'CZ18 •• 6604', sub: 'new payee · held', kind: 'warn', dir: 'out', amount: '68k Kč held', weight: 2,
        stats: [{ k: 'Account type', v: 'Small business' }, { k: 'FraudIntel', v: 'no matches' }],
        flags: ['No network flags — likely legitimate invoice'],
      },
      { id: 'reg', parent: 'biz', label: 'Registry', sub: 'verified business', kind: 'safe', dir: 'out', amount: '', weight: 1 },
      { id: 'sal2', label: 'Employer a.s.', sub: 'salary · monthly', kind: 'safe', dir: 'in', amount: '54k Kč /mo', weight: 1 },
      { id: 'cez2', label: 'ČEZ', sub: 'utility · regular', kind: 'safe', dir: 'out', amount: '1.4k Kč /mo', weight: 1 },
      { id: 'roh', label: 'Rohlik.cz', sub: 'recurring merchant', kind: 'safe', dir: 'out', amount: '2.2k Kč /wk', weight: 1 },
    ],
  },
};
