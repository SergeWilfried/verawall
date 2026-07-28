export interface ConsoleNavItem {
  // Stable id for the i18n key (nav.items.<id>) and React key; decoupled from
  // the displayed, translated label.
  id: string;
  label: string;
  badge?: string;
  to?: string;
}

export interface ConsoleNavGroup {
  id: string;
  title: string;
  items: ConsoleNavItem[];
}

export const navGroups: ConsoleNavGroup[] = [
  {
    id: 'monitoring',
    title: 'Monitoring',
    items: [
      { id: 'overview', label: 'Overview', to: '/console/overview' },
      { id: 'alerts', label: 'Alert Queue', badge: '23', to: '/console/alerts' },
      { id: 'detections', label: 'Detections', badge: '6', to: '/console/detections' },
      { id: 'transactionRisk', label: 'Transaction Risk', to: '/console/transaction-risk' },
    ],
  },
  {
    id: 'investigation',
    title: 'Investigation',
    items: [{ id: 'cases', label: 'Case Management', to: '/console/cases' }],
  },
  {
    id: 'intelligence',
    title: 'Intelligence',
    items: [{ id: 'scamflag', label: 'ScamFlag', badge: '5' }, { id: 'fraudintel', label: 'FraudIntel', to: '/console/fraud-intel' }],
  },
  {
    id: 'administration',
    title: 'Administration',
    items: [{ id: 'riskPolicies', label: 'Risk Policies' }, { id: 'reporting', label: 'Reporting' }, { id: 'settings', label: 'Platform Settings', to: '/console/settings' }],
  },
];
