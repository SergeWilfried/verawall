export type ThreatType = 'APP Scam' | 'Account Takeover' | 'Money Mule' | 'Phishing' | 'New Account Fraud';

export interface Alert {
  score: number;
  user: string;
  account: string;
  type: ThreatType;
  signal: string;
}

export interface TimelineEvent {
  t: string;
  event: string;
  detail: string;
  flag?: 'Anomaly' | 'Critical';
}

export interface ReviewDetail {
  id: string;
  detected: string;
  channel: string;
  sessionId: string;
  sessionDuration: string;
  state: 'Open' | 'Contained' | 'Resolved' | 'Terminated';
  timeline: TimelineEvent[];
  txn: { payee: string; amount: string; context: string; decision: string; resolution?: string } | null;
  intel: { name: string; match: string; desc: string } | null;
  facts: { k: string; v: string; ok: boolean }[];
  history: { kind: 'ok' | 'alert'; what: string; when: string }[];
  disposition?: string;
  caseId?: string;
}

export interface ProfileDetail {
  segment: string;
  since: string;
  sessions: string;
  riskNow: 'Critical' | 'High' | 'Elevated' | 'Contained' | 'Low';
  devices: { name: string; detail: string; ok: boolean }[];
  baseline: { k: string; v: string }[];
}

export interface Detection {
  name: string;
  type: ThreatType | null;
  count: number;
  trend: string;
  desc: string;
}
