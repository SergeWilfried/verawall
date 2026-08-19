// Inline SVG icon set for the marketing site — owned assets, no external
// images. Line icons in the signature red, drawn on a 48×48 grid.

import type { CSSProperties } from 'react';

export type IconKey =
  | 'scam'
  | 'phishing'
  | 'ato'
  | 'naf'
  | 'mule'
  | 'tra'
  | 'phone'
  | 'score'
  | 'shield'
  | 'console'
  | 'sdk'
  | 'lock'
  | 'hash'
  | 'key'
  | 'doc';

const PATHS: Record<IconKey, React.ReactNode> = {
  // phone handset + speech bubble — coached call
  scam: (
    <>
      <path d="M10 8h8l3 8-4 3c2 4 5 7 9 9l3-4 8 3v8a3 3 0 0 1-3 3C20 38 10 28 10 14a3 3 0 0 1 0-6z" />
      <path d="M30 6h12v9H34l-4 3v-3h0z" />
    </>
  ),
  // hook through a window — phishing / credential theft
  phishing: (
    <>
      <rect x="6" y="10" width="36" height="26" rx="3" />
      <path d="M6 17h36" />
      <path d="M24 22v10a4 4 0 0 0 8 0" />
      <circle cx="24" cy="21" r="1.6" />
    </>
  ),
  // user silhouette with a swap arrow — account takeover
  ato: (
    <>
      <circle cx="19" cy="16" r="6" />
      <path d="M7 40c0-7 5-12 12-12s12 5 12 12" />
      <path d="M30 10h10m0 0-3-3m3 3-3 3M42 20H32m0 0 3-3m-3 3 3 3" />
    </>
  ),
  // id card with a plus — new account fraud
  naf: (
    <>
      <rect x="6" y="12" width="36" height="24" rx="3" />
      <circle cx="16" cy="22" r="3.5" />
      <path d="M10 32c1-3 3.5-5 6-5s5 2 6 5" />
      <path d="M27 20h10M27 26h7" />
    </>
  ),
  // funds in → out through an account — money mule
  mule: (
    <>
      <circle cx="24" cy="24" r="7" />
      <path d="M4 24h10m0 0-3-3m3 3-3 3" />
      <path d="M34 16l10-6m-10 16 10 6m-10-10h10" />
    </>
  ),
  // gauge — transaction risk analysis
  tra: (
    <>
      <path d="M8 34a16 16 0 1 1 32 0" />
      <path d="M24 34 32 22" />
      <circle cx="24" cy="34" r="2.5" />
    </>
  ),
  phone: (
    <>
      <rect x="13" y="4" width="22" height="40" rx="4" />
      <path d="M21 9h6M20 39h8" />
    </>
  ),
  score: (
    <>
      <path d="M8 40V22m11 18V12m11 28V26m11 14V8" />
    </>
  ),
  shield: (
    <>
      <path d="M24 4 40 10v11c0 10-7 17-16 21C15 38 8 31 8 21V10z" />
      <path d="m17 24 5 5 9-11" />
    </>
  ),
  console: (
    <>
      <rect x="5" y="8" width="38" height="28" rx="3" />
      <path d="M5 16h38M11 24h10M11 29h16M30 24h6" />
      <path d="M18 42h12" />
    </>
  ),
  sdk: (
    <>
      <path d="m16 14-10 10 10 10M32 14l10 10-10 10M27 10l-6 28" />
    </>
  ),
  lock: (
    <>
      <rect x="10" y="20" width="28" height="22" rx="3" />
      <path d="M16 20v-6a8 8 0 0 1 16 0v6" />
      <circle cx="24" cy="31" r="2.5" />
    </>
  ),
  hash: (
    <>
      <path d="M18 6 14 42M34 6l-4 36M8 18h34M6 30h34" />
    </>
  ),
  key: (
    <>
      <circle cx="16" cy="30" r="8" />
      <path d="m22 24 18-18m-6 6 5 5m-10 0 5 5" />
    </>
  ),
  doc: (
    <>
      <path d="M12 4h16l10 10v30H12z" />
      <path d="M28 4v10h10M18 24h12M18 31h12M18 38h8" />
    </>
  ),
};

export function Icon({ name, size = 56, color = '#D71A28', style }: { name: IconKey; size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'block', ...style }}
    >
      {PATHS[name]}
    </svg>
  );
}
