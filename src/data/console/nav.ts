export interface ConsoleNavItem {
  label: string;
  badge?: string;
  to?: string;
}

export interface ConsoleNavGroup {
  title: string;
  items: ConsoleNavItem[];
}

export const navGroups: ConsoleNavGroup[] = [
  {
    title: 'Monitoring',
    items: [
      { label: 'Overview', to: '/console/overview' },
      { label: 'Alert Queue', badge: '23', to: '/console/alerts' },
      { label: 'Detections', badge: '6', to: '/console/detections' },
      { label: 'Transaction Risk', to: '/console/transaction-risk' },
    ],
  },
  {
    title: 'Investigation',
    items: [{ label: 'Case Management', to: '/console/cases' }, { label: 'Transaction Graph', to: '/console/graph' }],
  },
  {
    title: 'Intelligence',
    items: [{ label: 'ScamFlag', badge: '5' }, { label: 'FraudIntel', to: '/console/fraud-intel' }],
  },
  {
    title: 'Administration',
    items: [{ label: 'Risk Policies' }, { label: 'Reporting' }, { label: 'Platform Settings', to: '/console/settings' }],
  },
];
