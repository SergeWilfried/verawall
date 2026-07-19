export interface MegaLink {
  title: string;
  to?: string;
}

export interface MegaGroup {
  title: string;
  to?: string;
  sub: string;
  links?: MegaLink[];
}

export const solutionsMenu: MegaGroup[][] = [
  [
    {
      title: 'Scams & Social Engineering',
      sub: 'Intercept deceptive schemes and protect customers from scams.',
      links: [
        { title: 'Instant Payment Scams', to: '/instant-payment-scams' },
        { title: 'Authorized Push Payment Scams', to: '/solutions/app-scams' },
        { title: 'Investment Scams', to: '/solutions/investment-scams' },
        { title: 'Peer to Peer Fraud', to: '/solutions/p2p-fraud' },
        { title: 'Romance Scams', to: '/solutions/romance-scams' },
        { title: 'Purchase Scams', to: '/solutions/purchase-scams' },
      ],
    },
    {
      title: 'Phishing Detection & Mitigation',
      sub: 'Mitigate financial fraud with a proactive defense against phishing attacks.',
      links: [{ title: 'Credential Theft', to: '/solutions/credential-theft' }],
    },
  ],
  [
    {
      title: 'Account Takeover',
      to: '/solutions/account-takeover',
      sub: 'Prevent unauthorized access and safeguard customer accounts.',
      links: [
        { title: 'Remote Access Attacks' },
        { title: 'Session Hijacking' },
        { title: 'SIM Swap' },
        { title: 'Financial Malware' },
      ],
    },
    {
      title: 'Money Mules',
      to: '/solutions/money-mules',
      sub: 'Identify money mule accounts before fraudsters can cover their tracks.',
    },
    {
      title: 'New Account Fraud',
      to: '/solutions/new-account-fraud',
      sub: 'Detect new account fraud with advanced behavioral biometrics.',
      links: [{ title: 'Bonus Abuse' }, { title: 'Bot Attacks' }, { title: 'Loan Fraud' }],
    },
  ],
  [
    {
      title: 'Transaction Risk Analysis',
      to: '/solutions/transaction-risk',
      sub: 'Balance security and UX with the application of stringent security measures.',
      links: [
        { title: 'Strong & Invisible Authentication' },
        { title: 'Payment Transaction Authorization' },
        { title: '3D Secure Card Payments Authorization' },
      ],
    },
    {
      title: 'Department',
      sub: 'VeraWall supports the unspoken heroes in the fight against fraud.',
      links: [{ title: 'Security' }, { title: 'Risk and Compliance' }, { title: 'Digital Channels' }, { title: 'Fraud' }],
    },
  ],
];

export const platformTiles = [
  { title: 'Behavioral Intelligence Platform', desc: 'Constant monitoring of the now.' },
  { title: 'ScamFlag', desc: 'GenAI scam detection in your app.' },
  { title: 'Smart Insights', desc: 'Fewer false positives.' },
  { title: 'Cyber Fraud Fusion Center', desc: 'At the forefront of cyber threats.' },
  { title: 'FraudIntel', desc: 'Cross-border schemes in real time.' },
];
