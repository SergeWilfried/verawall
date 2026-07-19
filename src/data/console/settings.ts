export const tenantInfo = [
  { k: 'Tenant', v: 'Demo Bank' },
  { k: 'Environment', v: 'Production' },
  { k: 'Data region', v: 'EU (Frankfurt)' },
  { k: 'Data retention', v: '13 months' },
  { k: 'Platform version', v: 'BIP 8.4.2' },
  { k: 'Session ingestion', v: '48,211 / day' },
];

export const moduleToggleDefs = [
  { key: 'bip', name: 'Behavioral Intelligence', desc: 'Session profiling & anomaly detection — 48k sessions/day' },
  { key: 'scamflag', name: 'ScamFlag', desc: 'GenAI scam analysis of customer submissions' },
  { key: 'insights', name: 'Smart Insights', desc: 'False-positive tuning & model feedback' },
  { key: 'fraudintel', name: 'FraudIntel sharing', desc: 'Contribute & consume network intelligence' },
  { key: 'cffc', name: 'CFFC monitoring', desc: '24/7 Fusion Center escalation channel' },
];

export const notifDefs = [
  { key: 'digest', name: 'Daily e-mail digest', desc: 'Queue summary at 07:00 to fraud-ops list' },
  { key: 'webhook', name: 'Teams webhook', desc: 'New critical alerts posted to #fraud-ops' },
  { key: 'sms', name: 'SMS on critical', desc: 'Score ≥ 90 pages the on-call analyst' },
  { key: 'weekly', name: 'Weekly report', desc: 'Reporting summary mailed every Friday 17:00' },
];

export const integrationDefs = [
  { name: 'Core banking API', detail: 'Payment holds & releases · v2.4', status: 'Connected', ok: true },
  { name: '3DS Access Control Server', detail: 'Step-up challenge routing', status: 'Connected', ok: true },
  { name: 'SIEM export', detail: 'Splunk HEC · alerts & audit trail', status: 'Connected', ok: true },
  { name: 'KYC / onboarding provider', detail: 'Document & liveness checks', status: 'Action needed', ok: false },
];

export const teamDefs = [
  { name: 'F. Fillion', email: 'f.fillion@demobank.cz', role: 'Admin' },
  { name: 'P. Hruba', email: 'p.hruba@demobank.cz', role: 'Senior analyst' },
  { name: 'T. Marek', email: 't.marek@demobank.cz', role: 'Analyst' },
  { name: 'J. Sikora', email: 'j.sikora@demobank.cz', role: 'Analyst' },
  { name: 'CFFC service', email: 'cffc@verawall.com', role: 'Read-only' },
];

export const roleColors: Record<string, string> = {
  Admin: '#D71A28', 'Senior analyst': '#E67E22', Analyst: '#2C7BB6', 'Read-only': '#7A8593',
};

export const keyDefs = [
  { name: 'Production — core banking', masked: 'tm_live_ •••• 8f2c', scope: 'read/write', used: 'used 2 min ago' },
  { name: 'SIEM export', masked: 'tm_live_ •••• a911', scope: 'read', used: 'used 1 h ago' },
  { name: 'Staging sandbox', masked: 'tm_test_ •••• 04d7', scope: 'read/write', used: 'used 3 d ago' },
];
