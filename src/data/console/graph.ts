export type NodeKind = 'subject' | 'safe' | 'warn' | 'mule' | 'intel' | 'device';

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
  intel: { color: '#D71A28', name: 'Alert match', desc: 'matches an open alert' },
  device: { color: '#2C7BB6', name: 'Shared device link', desc: 'same install on both accounts' },
};
