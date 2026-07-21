import type { CSSProperties } from 'react';

/** Shimmering placeholder block. Size it to match the content it stands in
 *  for, so the real data lands without layout shift. */
export function Skeleton({ w = '100%', h = 12, r = 4, style }: {
  w?: number | string;
  h?: number | string;
  r?: number;
  style?: CSSProperties;
}) {
  return <span aria-hidden className="vw-skeleton" style={{ display: 'block', width: w, height: h, borderRadius: r, ...style }} />;
}

/** One placeholder table row matching a page's real grid template, so the
 *  loading table and the loaded table share geometry. Cell widths are
 *  jittered per row for a less mechanical look. */
export function SkeletonRow({ grid, cells, seed = 0, padding = '14px 22px' }: {
  grid: string;
  cells: { w?: number | string; h?: number; r?: number }[];
  seed?: number;
  padding?: string;
}) {
  const jitter = (i: number) => 0.72 + (((seed * 7 + i * 13) % 5) * 0.06);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: grid, alignItems: 'center', gap: 10, padding, borderBottom: '1px solid #F0F2F5' }}>
      {cells.map((c, i) => (
        <Skeleton
          key={i}
          w={c.w ?? `${Math.round(jitter(i) * 100)}%`}
          h={c.h ?? 12}
          r={c.r ?? 4}
        />
      ))}
    </div>
  );
}

/** Placeholder for a labeled stat / timeline line: short label bar over a
 *  longer value bar. */
export function SkeletonLines({ n = 3, gap = 14 }: { n?: number; gap?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton w={`${34 + ((i * 17) % 22)}%`} h={10} />
          <Skeleton w={`${68 + ((i * 11) % 26)}%`} h={12} />
        </div>
      ))}
    </div>
  );
}
