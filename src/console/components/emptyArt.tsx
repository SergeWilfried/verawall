// Empty-state illustrations — one consistent line-art set: 2px round
// strokes, greys #C9CED4/#7A8593 for structure, #D71A28 + #FBF1F2 as the
// single accent, 120×120 viewBox. Decorative only (aria-hidden).

const S = { grey: '#C9CED4', dark: '#7A8593', red: '#D71A28', tint: '#FBF1F2' };
const common = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Clear queue — shield with a check, calm ripples. */
export function ShieldClearArt() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="62" r="44" fill={S.tint} />
      <path {...common} stroke={S.grey} d="M18 76c6-3 12-3 18 0M84 40c5-2 10-2 15 0" />
      <path {...common} stroke={S.dark} fill="#fff"
        d="M60 22l26 9v22c0 17-10 30-26 37-16-7-26-20-26-37V31l26-9z" />
      <path {...common} stroke={S.red} strokeWidth={3} d="M47 60l9 9 17-19" />
    </svg>
  );
}

/** No cases — an open case folder with a resting document. */
export function CaseFolderArt() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="62" r="44" fill={S.tint} />
      <path {...common} stroke={S.grey} fill="#fff" d="M30 44v-8a4 4 0 0 1 4-4h16l6 8h30a4 4 0 0 1 4 4v6" />
      <path {...common} stroke={S.dark} fill="#fff" d="M24 50h68l-8 34a5 5 0 0 1-5 4H35a5 5 0 0 1-5-4l-6-34z" />
      <path {...common} stroke={S.red} d="M50 66h20M50 74h12" />
    </svg>
  );
}

/** No detections — radar dish mid-sweep, nothing on screen. */
export function RadarArt() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="60" r="44" fill={S.tint} />
      <circle {...common} stroke={S.grey} cx="60" cy="60" r="34" fill="#fff" />
      <circle {...common} stroke={S.grey} cx="60" cy="60" r="22" />
      <circle {...common} stroke={S.grey} cx="60" cy="60" r="10" />
      <path {...common} stroke={S.red} d="M60 60L84 38" strokeWidth={3} />
      <path d="M60 60 L84 38 A34 34 0 0 1 93 55 Z" fill="rgba(215,26,40,0.10)" />
      <circle cx="60" cy="60" r="3" fill={S.dark} />
    </svg>
  );
}

/** No decisions — a balance gauge at rest. */
export function GaugeArt() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="64" r="44" fill={S.tint} />
      <path {...common} stroke={S.dark} fill="#fff" d="M24 76a36 36 0 0 1 72 0" />
      <path {...common} stroke={S.grey} d="M32 76a28 28 0 0 1 8-20M88 76a28 28 0 0 0-8-20" />
      <path {...common} stroke={S.red} strokeWidth={3} d="M60 76l14-18" />
      <circle cx="60" cy="76" r="4" fill={S.dark} />
      <path {...common} stroke={S.grey} d="M36 90h48" />
    </svg>
  );
}

/** No graph subject — unlinked nodes waiting for a seed. */
export function NetworkArt() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="60" r="44" fill={S.tint} />
      <path {...common} stroke={S.grey} strokeDasharray="4 5" d="M60 60L34 38M60 60l30-14M60 60l-20 30M60 60l26 26" />
      <circle {...common} stroke={S.dark} cx="60" cy="60" r="11" fill="#fff" />
      <circle {...common} stroke={S.red} cx="34" cy="38" r="7" fill="#fff" />
      <circle {...common} stroke={S.grey} cx="90" cy="46" r="7" fill="#fff" />
      <circle {...common} stroke={S.grey} cx="40" cy="90" r="7" fill="#fff" />
      <circle {...common} stroke={S.grey} cx="86" cy="86" r="7" fill="#fff" />
    </svg>
  );
}

/** No API keys — a key over its outline slot. */
export function KeyArt({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <circle {...common} stroke="currentColor" cx="44" cy="60" r="16" fill="none" />
      <circle cx="44" cy="60" r="5" fill="currentColor" />
      <path {...common} stroke="currentColor" strokeWidth={3} d="M60 60h36M84 60v12M96 60v9" />
    </svg>
  );
}

/** Small pulse line — inline slots (activity feed). */
export function PulseArt({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <path {...common} stroke="currentColor" strokeWidth={4}
        d="M16 64h20l10-24 12 44 10-28 8 8h28" />
    </svg>
  );
}
