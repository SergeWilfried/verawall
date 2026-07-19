export const icons = {
  scam: 'https://www.threatmark.com/wp-content/uploads/2024/03/R1_Scams-and-social-engineering-exploitation_50x50-01.svg',
  phishing: 'https://www.threatmark.com/wp-content/uploads/2024/03/Phishing-mitigation_50x50-01.svg',
  ato: 'https://www.threatmark.com/wp-content/uploads/2024/03/Account-Takeover_Account-Takeover_50x50-01-1.svg',
  naf: 'https://www.threatmark.com/wp-content/uploads/2024/03/R1_Fraudulent-Account-Creation_50x50-01.svg',
  mule: 'https://www.threatmark.com/wp-content/uploads/2024/03/Money-Mules_50X50.svg',
  tra: 'https://www.threatmark.com/wp-content/uploads/2024/03/Transaction-Risk-Analysis_50x50.svg',
} as const;

export type IconKey = keyof typeof icons;
