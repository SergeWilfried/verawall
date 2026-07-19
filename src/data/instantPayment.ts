import type { Card, Stat } from './solutionPages';

export const instantPaymentStats: Stat[] = [
  { value: '63%', label: 'year-over-year increase of real-time payment transactions, in 2022.' },
  { value: '68%', label: 'increase in instant payment fraud year-over-year.' },
  { value: '12M', label: 'of the €20 million in losses due to transfer fraud between 2020 and 2021 came from instant payments.' },
];

export const instantPaymentCards: Card[] = [
  {
    icon: 'tra',
    title: 'Instant Payment Risk Scoring',
    desc: 'During vishing attacks, fraudsters employ evasive strategies to avoid detection, ensuring they can finish the transaction before being blocked. One of these strategies is to use high-priority transactions like instant or express payments. One way to block these fraudulent transactions is to scrutinize the priority attribute of a payment.',
  },
  {
    icon: 'scam',
    title: 'Mobile Phone Call Active',
    desc: 'Scams and social engineering fraud exploit the weakest link in the security chain, and that is the customer. Scammers use coercion to manipulate the victim into doing something against their best interest, including moving money. An active call during a banking session can indicate a scam in progress.',
  },
  {
    icon: 'mule',
    title: 'Abnormal Payment',
    desc: 'The payment amount, time of day or day of the month of transfer, and the beneficiary can all be analyzed for risk to uncover if the payment is abnormal. Looking at the context of the payment in combination with other risk indicators can prevent fraudulent payments.',
  },
];
