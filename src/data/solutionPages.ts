import type { IconKey } from './icons';

export interface Stat {
  value: string;
  label: string;
}

export interface Card {
  icon: IconKey;
  title: string;
  desc: string;
}

export interface SolutionPage {
  slug: string;
  category: string;
  isSub: boolean;
  title: string;
  sub: string;
  intro: string;
  statsTitle: string;
  stats: Stat[];
  spotTitle: string;
  paras: string[];
  cardsTitle: string;
  cards: Card[];
  /** Heading over the illustration band; defaults if unset. */
  artTitle?: string;
}

export const solutionPages: Record<string, SolutionPage> = {
  'app-scams': {
    slug: 'app-scams',
    artTitle: 'What a coached session looks like.',
    category: 'Scams & Social Engineering',
    isSub: true,
    title: 'Authorized Push Payment Scams',
    sub: 'APP scams manipulate victims into authorizing payments to fraudsters themselves.',
    intro:
      'Because the customer initiates the transfer, traditional controls that look for unauthorized access see nothing wrong. Fraudsters combine impersonation, urgency and emotional pressure to walk victims through every security step — making APP fraud one of the fastest-growing loss categories worldwide.',
    statsTitle: 'The impact of APP fraud.',
    stats: [
      { value: '£460M', label: 'lost to APP scams in the UK alone in a single year.' },
      { value: '48%', label: 'of financial institution executives see scams as the greatest modern threat.' },
      { value: '56%', label: 'of APP scam cases start with contact on social media or a phone call.' },
    ],
    spotTitle: 'Detect coercion, not just credentials.',
    paras: [
      'In an APP scam the right person logs in on the right device — so the fraud only becomes visible in how they behave. Behavioral intelligence detects the hallmarks of a coached session: hesitation on amount fields, unusual navigation, dictation-paced typing and an active phone call during the payment.',
      'By scoring the payment in the context of the whole session, the platform holds only the transfers that genuinely look coerced, while legitimate first-time payments proceed without friction.',
      'When a scam is confirmed, the payee account, the device and the outbound flow are traced in the follow-the-money graph, so the next payment to the same mule — from any of your customers — is caught on the first attempt.',
    ],
    cardsTitle: 'Understanding APP fraud.',
    cards: [
      {
        icon: 'scam',
        title: 'Coached Session Detection',
        desc: 'Victims being guided by a fraudster behave measurably differently — pausing, correcting and navigating in patterns that deviate from their learned profile. These signals surface coercion in real time.',
      },
      {
        icon: 'tra',
        title: 'First-Time Payee Risk',
        desc: 'Most APP losses go to accounts the victim has never paid before. Payee novelty, amount deviation and transfer urgency combine into a strong scam indicator.',
      },
      {
        icon: 'mule',
        title: 'Mule Account Correlation',
        desc: "The destination account is the fraudster's weak point. Cross-referencing payees against known mule networks stops scams even when the victim is fully convinced.",
      },
    ],
  },

  'investment-scams': {
    slug: 'investment-scams',
    category: 'Scams & Social Engineering',
    isSub: true,
    title: 'Investment Scams',
    sub: 'Investment scams lure victims with promises of extraordinary returns.',
    intro:
      "From fake crypto platforms to 'mentors' with guaranteed profits, investment scams groom victims over weeks — small test withdrawals build trust before the life-changing losses. Victims willingly authorize every payment, defeating traditional fraud controls.",
    statsTitle: 'The impact of investment fraud.',
    stats: [
      { value: '$4.6B', label: 'lost globally to investment scams in a single year — the costliest scam category.' },
      { value: '10x', label: 'growth in crypto-related investment scam reports over five years.' },
      { value: '70%', label: 'of victims are first contacted through social media or messaging apps.' },
    ],
    spotTitle: 'Break the grooming cycle in real-time.',
    paras: [
      "Investment scams follow a recognizable payment trajectory: a small first transfer to a new payee, followed by escalating amounts to the same destination or linked accounts. Behavioral intelligence flags this progression as it forms.",
      "Destination analysis is decisive — payments to crypto exchanges and payment processors that are unusual for the customer's profile, combined with scam-typical session behavior, trigger a hold before funds leave the bank.",
      'The cross-session pattern carries the signal: two consecutive rising payments to the same payee — the romance and investment-scam signature — raise ESCALATING_PAYEE even when no call is in progress, and the customer is shown the anti-scam warning instead of an identity challenge they would pass.',
    ],
    cardsTitle: 'Understanding investment fraud.',
    cards: [
      {
        icon: 'tra',
        title: 'Escalating Payment Pattern',
        desc: 'A small test payment followed by rapidly growing transfers to the same new payee is the signature of an investment scam in progress — detectable at the second payment, not the last.',
      },
      {
        icon: 'scam',
        title: 'Scam Message Analysis',
        desc: 'Coached sessions are measurable: an active call or a shared screen during the transfer, dictation-paced typing, and a payee added minutes before paying. Each raises the score; together they classify the session as an APP scam.',
      },
      {
        icon: 'mule',
        title: 'Exchange & Wallet Intelligence',
        desc: "Payout accounts confirmed in one case are classified as intel in the follow-the-money graph, so the same destination lights up red the next time any customer pays it.",
      },
    ],
  },

  'p2p-fraud': {
    slug: 'p2p-fraud',
    category: 'Scams & Social Engineering',
    isSub: true,
    title: 'Peer to Peer Fraud',
    sub: 'P2P payment fraud exploits the instant, irreversible nature of person-to-person transfers.',
    intro:
      'P2P apps and instant transfer schemes are designed for speed between people who trust each other — which is exactly what fraudsters exploit. Fake buyers, fake sellers and impersonated friends extract payments that cannot be recalled.',
    statsTitle: 'The impact of P2P fraud.',
    stats: [
      { value: '3x', label: 'higher fraud rate on P2P transfers than on traditional payment rails.' },
      { value: '18–34', label: 'the age group most frequently targeted by P2P payment scams.' },
      { value: '<1 min', label: 'typical time for stolen P2P funds to be forwarded out of reach.' },
    ],
    spotTitle: 'Protect transfers between people.',
    paras: [
      "P2P fraud hides in small, frequent payments — so per-transaction rules fail. Behavioral intelligence evaluates each transfer against the customer's social payment graph: who they pay, how often, and in what amounts.",
      "Impersonation scams ('Mum, I lost my phone — pay this bill') break the pattern instantly: a new counterparty, an urgent amount and session behavior showing stress or coaching.",
      'Real-time scoring means the risky transfer is held for a confirmation prompt while normal repayments between friends flow untouched.',
    ],
    cardsTitle: 'Understanding P2P fraud.',
    cards: [
      {
        icon: 'scam',
        title: 'Impersonation Detection',
        desc: 'Messages impersonating family members drive urgent payments to unknown accounts. Counterparty novelty plus urgency signals expose the pattern.',
      },
      {
        icon: 'tra',
        title: 'Payment Graph Anomalies',
        desc: 'Every customer has a stable network of people they pay. Transfers outside that graph, at unusual amounts or hours, carry measurably higher risk.',
      },
      {
        icon: 'mule',
        title: 'Rapid Cash-Out Tracking',
        desc: 'P2P scam proceeds move fast. Velocity analysis on receiving accounts identifies mule behavior before funds are layered away.',
      },
    ],
  },

  'romance-scams': {
    slug: 'romance-scams',
    category: 'Scams & Social Engineering',
    isSub: true,
    title: 'Romance Scams',
    sub: 'Romance scams weaponize emotional relationships built over months.',
    intro:
      "Fraudsters cultivate online relationships specifically to extract money — an emergency, a plane ticket, an investment 'for our future'. Victims defend the fraudster against the bank's own warnings, making detection and intervention uniquely difficult.",
    statsTitle: 'The impact of romance fraud.',
    stats: [
      { value: '$1.3B', label: 'reported lost to romance scams in a single year — with most cases never reported.' },
      { value: '6–8 mo', label: 'typical grooming period before the first money request.' },
      { value: '64%', label: 'of romance scam payments go through instant or wire transfers.' },
    ],
    spotTitle: 'Intervene where words fail.',
    paras: [
      'Romance scam victims genuinely want to send the money — so the intervention has to come from the payment pattern, not the customer. Recurring transfers to a never-met counterparty, often abroad, escalating over time, form a detectable signature.',
      'Session behavior adds evidence: payments made during or immediately after long messaging sessions, with hesitation and correction patterns that reveal emotional stress.',
      "A well-timed hold with a tailored warning — naming the pattern, not just 'possible fraud' — is proven to break the spell where generic alerts fail.",
    ],
    cardsTitle: 'Understanding romance fraud.',
    cards: [
      {
        icon: 'scam',
        title: 'Grooming Pattern Recognition',
        desc: 'Escalating transfers to a single overseas counterparty with no commercial context follow a known trajectory that behavioral models detect early.',
      },
      {
        icon: 'tra',
        title: 'Emotional Session Signals',
        desc: 'Payments initiated under emotional pressure carry measurable behavioral markers — hesitation, re-typing, unusual session hours.',
      },
      {
        icon: 'phishing',
        title: 'Tailored Interventions',
        desc: 'Breaking a romance scam requires a specific, empathetic warning at the moment of payment. Context-aware messaging outperforms generic fraud alerts.',
      },
    ],
  },

  'purchase-scams': {
    slug: 'purchase-scams',
    category: 'Scams & Social Engineering',
    isSub: true,
    title: 'Purchase Scams',
    sub: 'Purchase scams sell goods that never existed — at prices too good to refuse.',
    intro:
      "Fake marketplace listings, cloned shops and 'private sellers' pressure victims into instant payment for cars, electronics and apartments that never arrive. The payment is authorized, instant and unrecoverable.",
    statsTitle: 'The impact of purchase fraud.',
    stats: [
      { value: '#1', label: 'purchase scams are the most common scam type by number of victims.' },
      { value: '74%', label: 'of purchase scams originate on social media marketplaces.' },
      { value: '£86M', label: 'lost to purchase scams in the UK in a single year.' },
    ],
    spotTitle: "Stop payments for goods that don't exist.",
    paras: [
      "Purchase scams share a payment fingerprint: an instant transfer to a new personal account, for an amount typical of goods, often demanded with time pressure ('I'll take the listing down today'). Behavioral intelligence scores this combination in real time.",
      'Receiving-account intelligence is decisive — scam sellers reuse accounts across dozens of victims, so a payee flagged once protects everyone who tries to pay it after.',
      'At the moment of payment the session tells the story: a brand-new payee, an amount out of profile, a live chat or call — scored together, they trigger the in-app anti-scam warning before the transfer is released.',
    ],
    cardsTitle: 'Understanding purchase fraud.',
    cards: [
      {
        icon: 'tra',
        title: 'Goods-Payment Anomalies',
        desc: "Instant transfers to personal accounts for merchandise-sized amounts, outside the customer's normal pattern, are the core purchase-scam signal.",
      },
      {
        icon: 'mule',
        title: 'Payee Reputation',
        desc: 'Scam sellers collect from many victims into few accounts. Network-level payee intelligence stops the tenth victim at the first attempt.',
      },
      {
        icon: 'scam',
        title: 'Conversation Analysis',
        desc: 'A payee added and paid within minutes, while a call is active or a screen is shared, is the purchase-scam tell the session exposes — and the trigger for an anti-scam warning.',
      },
    ],
  },

  'credential-theft': {
    slug: 'credential-theft',
    artTitle: 'Valid credentials, invalid behavior.',
    category: 'Phishing Detection & Mitigation',
    isSub: true,
    title: 'Credential Theft',
    sub: "Stolen credentials turn a customer's own login into the fraudster's key.",
    intro:
      'Phishing pages, infostealer malware and data breaches feed a constant supply of valid usernames and passwords. Once credentials are stolen, the attacker logs in as the customer — and only behavior tells the two apart.',
    statsTitle: 'The impact of credential theft.',
    stats: [
      { value: '90%', label: 'of cyber attacks begin with phishing.' },
      { value: '24B+', label: 'credential pairs circulating on criminal marketplaces.' },
      { value: '<2h', label: 'median time from phishing submission to first fraudulent login attempt.' },
    ],
    spotTitle: 'Valid credentials, invalid behavior.',
    paras: [
      'A stolen password passes every knowledge check — but the person typing it cannot fake the owner’s behavioral profile. Typing cadence, navigation habits and device handling expose the imposter within seconds of login.',
      'Infrastructure intelligence compounds the signal: logins from IPs, devices and automation frameworks tied to known phishing campaigns are flagged before any behavioral evidence is even needed.',
      'Device novelty compounds it: a first-ever install, a SIM changed since the last session, a headless browser or automation framework — each is scored at login, so the stolen credential is stopped at its first use, not its first transfer.',
    ],
    cardsTitle: 'Understanding credential theft.',
    cards: [
      {
        icon: 'phishing',
        title: 'Phishing Infrastructure Tracking',
        desc: 'Headless and automated browsers, emulators and automation frameworks are fingerprinted at session start — the infrastructure credential-stuffing runs on, flagged before a single login succeeds.',
      },
      {
        icon: 'ato',
        title: 'Behavioral Login Verification',
        desc: "Every login is silently compared to the owner's learned profile. An imposter with a perfect password still types like a stranger.",
      },
      {
        icon: 'tra',
        title: 'Step-Up Only When Needed',
        desc: 'Suspicious logins get a strong authentication challenge; genuine customers with matching behavior sail through invisibly.',
      },
    ],
  },

  'account-takeover': {
    slug: 'account-takeover',
    artTitle: 'The owner and the imposter behave differently.',
    category: 'Account Takeover',
    isSub: false,
    title: 'Account Takeover',
    sub: "ATO gives fraudsters full control of a legitimate customer's account.",
    intro:
      'Through remote access tools, session hijacking, SIM swap or malware, attackers gain unauthorized control and drain accounts from inside. Detection has to happen in the session itself — before the money moves.',
    statsTitle: 'The impact of account takeover.',
    stats: [
      { value: '$13B', label: 'in global losses attributed to account takeover in a single year.' },
      { value: '354%', label: 'year-over-year growth in ATO attacks at their recent peak.' },
      { value: '22%', label: 'of adults have had an online account taken over at least once.' },
    ],
    spotTitle: 'Expose the stranger inside the session.',
    paras: [
      'Whatever the entry vector — RAT, hijacked session, swapped SIM — the attacker eventually has to act. And acting means behaving: typing, navigating, transferring. Behavioral biometrics compare every action to the owner’s learned profile and expose the mismatch in real time.',
      'Technical signals sharpen the verdict: remote-access artifacts, automation signatures, impossible travel, device and network anomalies each add to the risk score.',
      'On detection the platform can terminate the session, force credential reset and hold pending payments automatically — containing the takeover in seconds rather than hours.',
    ],
    cardsTitle: 'Understanding account takeover.',
    cards: [
      {
        icon: 'ato',
        title: 'Remote Access Detection',
        desc: "Screen-sharing artifacts, input latency and control patterns reveal AnyDesk-style tools even when the session comes from the customer's own device.",
      },
      {
        icon: 'phishing',
        title: 'Session Hijacking & SIM Swap',
        desc: 'Stolen session tokens and swapped SIMs bypass authentication entirely — but not the behavioral profile of the person now operating the account.',
      },
      {
        icon: 'tra',
        title: 'Automatic Containment',
        desc: 'Kill the session, reset credentials, hold payments — automated response contains a takeover before losses occur.',
      },
    ],
  },

  'money-mules': {
    slug: 'money-mules',
    artTitle: 'The money betrays the mule.',
    category: 'Money Mules',
    isSub: false,
    title: 'Money Mules',
    sub: 'Mule accounts are the exit ramp for every fraud scheme.',
    intro:
      'Stolen and scammed funds have to land somewhere — in accounts recruited, rented or opened specifically to launder them. Identify the mule and you cut off the fraudster’s payout, whatever the original scheme.',
    statsTitle: 'The impact of money mules.',
    stats: [
      { value: '90%', label: 'of mule transactions are linked to cybercrime proceeds.' },
      { value: '3–5', label: 'layers of mule accounts in a typical laundering chain.' },
      { value: '€17.5M', label: 'intercepted in a single European anti-mule operation.' },
    ],
    spotTitle: "Cut off the fraudster's payout.",
    paras: [
      'Mule accounts betray themselves through velocity: dormant accounts that suddenly receive and immediately forward funds, splitting amounts across counterparties within minutes. Behavioral intelligence detects the in-out pattern as it happens.',
      'Account-link analysis maps the network — shared devices, matching behavioral fingerprints and common counterparties connect one detected mule to the whole ring.',
      'Findings feed compliance directly: a confirmed fraud automatically opens its AML case with the post-compromise outbound-flow trace attached — the two-files doctrine, so the fraud file and the laundering file are never out of step.',
    ],
    cardsTitle: 'Understanding mule activity.',
    cards: [
      {
        icon: 'mule',
        title: 'Rapid In-Out Velocity',
        desc: 'Funds that arrive and leave within minutes, split across multiple recipients, are the defining mule signature — detectable on the first cycle.',
      },
      {
        icon: 'naf',
        title: 'Recruited & Synthetic Accounts',
        desc: 'Some mules are opened for the purpose. Onboarding biometrics and dormancy-reactivation patterns flag accounts created to launder.',
      },
      {
        icon: 'ato',
        title: 'Network Mapping',
        desc: 'Shared devices and behavioral fingerprints link mule accounts into rings — one detection exposes the entire network.',
      },
    ],
  },

  'new-account-fraud': {
    slug: 'new-account-fraud',
    artTitle: 'The imposter shows at the door.',
    category: 'New Account Fraud',
    isSub: false,
    title: 'New Account Fraud',
    sub: 'Fraudsters open accounts with stolen and synthetic identities.',
    intro:
      'Bonus abuse, loan fraud, mule account creation — it all starts with an account opened under a false identity. Documents can be stolen or forged; the behavior of the person filling in the application cannot.',
    statsTitle: 'The impact of new account fraud.',
    stats: [
      { value: '$5.3B', label: 'in annual losses from synthetic identity fraud alone.' },
      { value: '85%', label: 'of synthetic identities evade traditional KYC document checks.' },
      { value: '#1', label: 'synthetic identity is the fastest-growing financial crime category.' },
    ],
    spotTitle: 'Catch the imposter at the door.',
    paras: [
      'Behavioral biometrics evaluate the application session itself: how personal data is entered reveals whether the applicant owns it. Genuine users type their own birthdate fluently; imposters copy-paste, hesitate and correct.',
      "Declared identity is cross-checked against behavioral age and device history — a 61-year-old identity typed at a 20-year-old's cadence, on a device seen across other applications, scores immediately.",
      'Bot and emulator detection filters industrialized attacks, and device history links one flagged application to the next attempt from the same install.',
    ],
    cardsTitle: 'Understanding new account fraud.',
    cards: [
      {
        icon: 'naf',
        title: 'Application Behavior Analysis',
        desc: "Copy-pasted personal data, dictation-paced typing and age-inconsistent cadence expose applicants who don't own the identity they claim.",
      },
      {
        icon: 'ato',
        title: 'Device & Identity Correlation',
        desc: 'One device behind many applications, or one identity across many institutions, surfaces organized new-account fraud rings.',
      },
      {
        icon: 'phishing',
        title: 'Bot & Emulator Defense',
        desc: 'Automation frameworks and emulators used for bulk account creation are fingerprinted and blocked at scale.',
      },
    ],
  },

  'transaction-risk': {
    slug: 'transaction-risk',
    artTitle: 'One score, three proportionate outcomes.',
    category: 'Transaction Risk Analysis',
    isSub: false,
    title: 'Transaction Risk Analysis',
    sub: 'Score every payment — apply friction only where risk demands it.',
    intro:
      'Blanket step-up authentication frustrates customers and still misses coerced payments. Adaptive transaction risk analysis evaluates every payment in full session context, approving the safe ones invisibly and challenging only genuine risk.',
    statsTitle: 'The impact of adaptive risk analysis.',
    stats: [
      { value: '55%', label: 'of mobile-money providers rate their current fraud system “not so effective” (GSMA, 2024).' },
      { value: '10%', label: 'of providers use AI or machine learning in fraud management — the rest run on rules (GSMA, 2024).' },
      { value: '0–100', label: 'risk score per payment, with ALLOW / STEP_UP / HOLD bands tuned per tenant and per currency.' },
    ],
    spotTitle: 'Security and UX are not a trade-off.',
    paras: [
      "Every payment is scored in real time against the full context: the user's behavioral profile, device trust, network, payee history and amount pattern. Low-risk payments — the vast majority — are approved silently.",
      'Elevated risk triggers proportionate response: a 3DS challenge or strong authentication step-up. Only genuinely high-risk payments are held for analyst review.',
      'Because behavioral profile match itself constitutes strong customer authentication, banks can claim SCA exemptions and remove friction from compliant flows — invisible authentication in action.',
    ],
    cardsTitle: 'Understanding transaction risk analysis.',
    cards: [
      {
        icon: 'tra',
        title: 'Adaptive Risk Scoring',
        desc: '0–100 risk score per payment drives a graduated policy: approve silently, step up, or hold — stringent measures only where risk demands.',
      },
      {
        icon: 'ato',
        title: 'Strong & Invisible Authentication',
        desc: 'A matching behavioral profile authenticates the customer without any interaction — stronger than SMS codes, invisible to the user.',
      },
      {
        icon: 'phishing',
        title: '3D Secure Authorization',
        desc: 'Card payments flow through the same risk engine, challenging 3DS only when session and transaction context warrant it.',
      },
    ],
  },
  'agent-fraud': {
    slug: 'agent-fraud',
    category: 'Agent Commission Fraud',
    isSub: false,
    title: 'Agent Commission Fraud',
    artTitle: 'What commission farming looks like on the ledger.',
    sub: 'Agents manipulate transactions to farm commissions they were never owed.',
    intro:
      'In agent-assisted mobile money the human agent sits between the customer and the ledger — and a dishonest one can split, structure and route transactions to inflate the commissions they earn. It looks like ordinary volume, so rule-based monitoring waves it through.',
    statsTitle: 'The impact of agent fraud.',
    stats: [
      { value: '56%', label: 'of mobile-money providers cite agent commission fraud as a prevalent scheme (GSMA, 2024).' },
      { value: '84%', label: 'of agent-fraud cases are commission (arbitrage) fraud — the top agent scheme (GSMA, 2024).' },
      { value: 'Feed', label: 'scored straight from your transaction feed — no SDK, no change to the customer app.' },
    ],
    spotTitle: 'Read the ledger, not the app.',
    paras: [
      'Commission fraud has a shape on the ledger: a burst of small transactions routed through a single counterparty, placed just under commission or reporting thresholds, concentrated on one agent account within a short window.',
      'VeraWall scores this directly from your transaction feed — the same feed that powers mule detection — so agent fraud is caught with no SDK and no change to the customer app.',
      'Confirmed cases feed the follow-the-money graph and, where proceeds moved, open a linked AML file — the same two-files doctrine as every other typology.',
    ],
    cardsTitle: 'Understanding agent fraud.',
    cards: [
      {
        icon: 'mule',
        title: 'Split Transaction Pattern',
        desc: 'A single agent account cycling many small transactions through one counterparty is the commission-farming signature — scored on a rolling 24-hour window.',
      },
      {
        icon: 'tra',
        title: 'Threshold Structuring',
        desc: 'Amounts placed just under commission or reporting thresholds, repeated across a session, reveal deliberate structuring rather than genuine trade.',
      },
      {
        icon: 'ato',
        title: 'Collusion Mapping',
        desc: 'Shared counterparties and devices link a fraudulent agent to the accounts moving the proceeds — one detection exposes the ring.',
      },
    ],
  },
};

export const solutionOrder = [
  'app-scams',
  'investment-scams',
  'p2p-fraud',
  'romance-scams',
  'purchase-scams',
  'credential-theft',
  'account-takeover',
  'money-mules',
  'agent-fraud',
  'new-account-fraud',
  'transaction-risk',
];
