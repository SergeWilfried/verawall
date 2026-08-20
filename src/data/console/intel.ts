export type Severity = 'Critical' | 'High' | 'Medium';

export interface IntelItem {
  name: string;
  severity: Severity;
  region: string;
  source: string;
  when: string;
  desc: string;
}

export const intelDefs: IntelItem[] = [
  {
    name: 'Operation SafeAccount', severity: 'Critical', region: 'CZ / SK / AT', source: 'analyst confirmed', when: '35 min ago',
    desc: 'Coordinated vishing campaign impersonating bank security teams; 40+ mule IBANs confirmed across cases, 3 seen in your traffic.',
  },
  {
    name: 'post-cz delivery smishing', severity: 'High', region: 'CZ', source: 'open investigation', when: '2h ago',
    desc: 'SMS wave with fake customs-fee pages harvesting card data. 17 lookalike domains registered this week.',
  },
  {
    name: 'Crypto mentor ring', severity: 'High', region: 'EU-wide', source: 'payee intel — escalating payments', when: '6h ago',
    desc: 'Investment scam ring recruiting via social media; funds funneled through layered mule accounts to exchanges.',
  },
  {
    name: 'NFC relay cash-outs', severity: 'Medium', region: 'PL / CZ', source: 'ledger detector', when: '1d ago',
    desc: 'Ghost-tap cash-out pattern using relayed NFC transactions at ATMs; device fingerprints shared for blocking.',
  },
];

export const severityColors: Record<Severity, string> = {
  Critical: '#D71A28', High: '#E67E22', Medium: '#2C7BB6',
};

export const confirmedDestinations = 14;
export const matchesYourTraffic = 3;
