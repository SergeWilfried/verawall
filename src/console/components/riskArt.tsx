// Risk Policies wizard illustrations — same line-art system as emptyArt.tsx:
// 2px round strokes, greys #C9CED4/#7A8593 for structure, #D71A28 + #FBF1F2
// as the single accent, 120×120 viewBox. Decorative only (aria-hidden).
//
// The three appetite marks are deliberately ONE drawing — a gauge — with the
// needle swept low / mid / high, so the set reads as positions on an axis
// rather than three unrelated pictures.

const S = { grey: '#C9CED4', dark: '#7A8593', red: '#D71A28', tint: '#FBF1F2' };
const common = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const SIZE = 56;

/** Microfinance — a savings group: three heads over a shared coin stack. */
export function MicrofinanceArt() {
  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="62" r="44" fill={S.tint} />
      <circle {...common} stroke={S.dark} fill="#fff" cx="60" cy="44" r="10" />
      <circle {...common} stroke={S.grey} fill="#fff" cx="38" cy="50" r="8" />
      <circle {...common} stroke={S.grey} fill="#fff" cx="82" cy="50" r="8" />
      <path {...common} stroke={S.grey} d="M26 78c2-9 6-14 12-14M94 78c-2-9-6-14-12-14" />
      <path {...common} stroke={S.dark} d="M46 82c1-12 6-18 14-18s13 6 14 18" />
      <g {...common} stroke={S.red}>
        <ellipse cx="60" cy="88" rx="12" ry="4" fill="#fff" />
        <path d="M48 88v6c0 2.2 5.4 4 12 4s12-1.8 12-4v-6" />
      </g>
    </svg>
  );
}

/** Mobile money / wallet — a phone exchanging value both ways. */
export function WalletArt() {
  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="62" r="44" fill={S.tint} />
      <rect {...common} stroke={S.dark} fill="#fff" x="44" y="30" width="32" height="58" rx="6" />
      <path {...common} stroke={S.grey} d="M54 36h12" />
      <circle {...common} stroke={S.grey} cx="60" cy="80" r="3" />
      <circle {...common} stroke={S.red} cx="60" cy="56" r="9" fill="#fff" />
      <path {...common} stroke={S.red} d="M57 56h6M60 53v6" />
      <path {...common} stroke={S.red} d="M36 50l-8 6 8 6" />
      <path {...common} stroke={S.dark} d="M84 62l8-6-8-6" />
      <path {...common} stroke={S.red} d="M28 56h10" />
      <path {...common} stroke={S.dark} d="M82 56h10" />
    </svg>
  );
}

/** Ridesharing / gig payouts — a route between two pins, car on the way. */
export function RidesharingArt() {
  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="62" r="44" fill={S.tint} />
      <path {...common} stroke={S.grey} strokeDasharray="4 6" d="M34 82c10 2 18-4 22-12s10-16 24-16" />
      <path {...common} stroke={S.dark} fill="#fff"
        d="M34 58a10 10 0 0 1 10 10c0 7-10 16-10 16s-10-9-10-16a10 10 0 0 1 10-10z" />
      <circle cx="34" cy="68" r="3" fill={S.dark} />
      <path {...common} stroke={S.red} fill="#fff"
        d="M86 34a9 9 0 0 1 9 9c0 6-9 14-9 14s-9-8-9-14a9 9 0 0 1 9-9z" />
      <circle cx="86" cy="43" r="2.6" fill={S.red} />
      <g {...common} stroke={S.dark}>
        <path fill="#fff" d="M52 92l3-7a5 5 0 0 1 5-3h8a5 5 0 0 1 5 3l3 7z" />
        <path d="M50 92h28" />
        <circle fill="#fff" cx="56" cy="95" r="3" />
        <circle fill="#fff" cx="72" cy="95" r="3" />
      </g>
    </svg>
  );
}

/** Retail bank — the classic portico, red door as the accent. */
export function BankArt() {
  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="62" r="44" fill={S.tint} />
      <path {...common} stroke={S.dark} fill="#fff" d="M28 52l32-20 32 20z" />
      <path {...common} stroke={S.grey} d="M34 58v26M48 58v26M72 58v26M86 58v26" />
      <path {...common} stroke={S.dark} d="M26 90h68" />
      <path {...common} stroke={S.grey} d="M30 84h60" />
      <path {...common} stroke={S.red} fill="#fff" d="M56 90v-14a4 4 0 0 1 8 0v14" />
      <circle cx="60" cy="44" r="3" fill={S.red} />
    </svg>
  );
}

/** One gauge, three needle positions — the appetite axis. */
function Gauge({ angle, tone }: { angle: number; tone: string }) {
  const rad = ((angle - 180) * Math.PI) / 180;
  const x = 60 + 26 * Math.cos(rad);
  const y = 74 + 26 * Math.sin(rad);
  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="62" r="44" fill={S.tint} />
      <path {...common} stroke={S.grey} fill="#fff" d="M26 74a34 34 0 0 1 68 0" />
      <path {...common} stroke={S.grey} d="M26 74h8M86 74h8M36 52l5 5M84 52l-5 5M60 40v7" />
      <path {...common} stroke={tone} strokeWidth={3} d={`M60 74L${x.toFixed(1)} ${y.toFixed(1)}`} />
      <circle cx="60" cy="74" r="4" fill={tone} />
      <path {...common} stroke={S.dark} d="M40 90h40" />
    </svg>
  );
}

/** Conservative — needle low, ink tone: nothing to be alarmed about. */
export function ConservativeArt() {
  return <Gauge angle={35} tone={S.dark} />;
}

/** Balanced — needle at noon. */
export function BalancedArt() {
  return <Gauge angle={90} tone={S.dark} />;
}

/** Growth-first — needle high, in the accent: risk deliberately taken. */
export function GrowthArt() {
  return <Gauge angle={145} tone={S.red} />;
}
