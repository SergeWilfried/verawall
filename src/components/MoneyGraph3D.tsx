// Follow-the-money graph band for the money-mules page.
//
// This wrapper imports NO three.js — it decides whether the heavy WebGL canvas
// should load at all, so users who never see it (or ask for reduced motion)
// never download it:
//   • prefers-reduced-motion  → static SVG only, three.js never fetched.
//   • not yet scrolled into view → static SVG placeholder; the 3D chunk is
//     lazy-imported the first time the band enters the viewport.
// The static SVG is a real, legible fallback (same network shape), not a blank.

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';

const MoneyGraph3DCanvas = lazy(() => import('./MoneyGraph3DCanvas'));

const RED = '#D71A28';
const GREEN = '#1E9E5A';
const INK = '#1E262E';
const AMBER = '#C67C00';
const LINE = '#E3E7EB';
const MUTED = '#5A6976';

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

// 2D projection of the same laundering network — the reduced-motion / loading
// view. Victim (green) → mule hub (ink) → cash-out mules (red) → next hop
// (amber); dashed = shared device.
function StaticGraph() {
  const nodes: Record<string, [number, number, string, number]> = {
    victim: [70, 232, GREEN, 15],
    mule: [360, 230, INK, 26],
    o1: [560, 120, RED, 13],
    o2: [600, 235, RED, 14],
    o3: [560, 340, RED, 12],
    o4: [470, 400, RED, 11],
    o5: [470, 90, RED, 11],
    h1: [760, 95, AMBER, 9],
    h2: [800, 250, AMBER, 9],
    h3: [760, 370, AMBER, 9],
  };
  const edges: [string, string, string, boolean][] = [
    ['victim', 'mule', GREEN, false],
    ['mule', 'o1', RED, false],
    ['mule', 'o2', RED, false],
    ['mule', 'o3', RED, false],
    ['mule', 'o4', RED, false],
    ['mule', 'o5', RED, false],
    ['o1', 'h1', AMBER, false],
    ['o2', 'h2', AMBER, false],
    ['o3', 'h3', AMBER, false],
    ['o2', 'o3', '#9AA4AF', true],
  ];
  return (
    <svg viewBox="0 0 860 460" width="100%" height="100%" style={{ display: 'block' }} role="img" aria-label="Follow-the-money graph: a victim payment into a mule account fanning out to cash-out accounts.">
      {edges.map(([a, b, c, dash], i) => {
        const [x1, y1] = nodes[a];
        const [x2, y2] = nodes[b];
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={2} strokeOpacity={0.6} strokeDasharray={dash ? '6 5' : undefined} />;
      })}
      <circle cx={nodes.mule[0]} cy={nodes.mule[1]} r={38} fill="none" stroke={RED} strokeWidth={2} strokeOpacity={0.4} />
      {Object.entries(nodes).map(([id, [x, y, c, r]]) => (
        <circle key={id} cx={x} cy={y} r={r} fill={c} />
      ))}
    </svg>
  );
}

function Legend() {
  const { t } = useLanguage();
  const items: [string, string][] = [
    [GREEN, t('Victim payment')],
    [INK, t('Mule account')],
    [RED, t('Cash-out mules')],
    [AMBER, t('Next hop')],
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 18 }}>
      {items.map(([c, label]) => (
        <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: MUTED }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: c }} />
          {label}
        </span>
      ))}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: MUTED }}>
        <span style={{ width: 16, height: 0, borderTop: '2px dashed #9AA4AF' }} />
        {t('Shared device')}
      </span>
    </div>
  );
}

export function MoneyGraph3D({ title }: { title: string }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const use3d = inView && !reduced;

  return (
    <section style={{ background: '#FBFBFC', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '48px 15px' : '72px 15px' }}>
        <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700, textAlign: 'center', textWrap: 'balance' }}>{t(title)}</h2>
        <p style={{ fontSize: 17, color: MUTED, textAlign: 'center', maxWidth: 640, margin: '18px auto 0', lineHeight: 1.7 }}>
          {t('One mule account rarely acts alone. VeraWall traces the flow from the victim payment through the cash-out network — the same graph an analyst opens on a confirmed alert.')}
        </p>

        <div
          ref={ref}
          style={{
            position: 'relative',
            marginTop: isMobile ? 28 : 44,
            height: isMobile ? 340 : 460,
            background: '#fff',
            border: `1px solid ${LINE}`,
            borderRadius: 12,
            boxShadow: '0 20px 50px rgba(20,30,40,0.10)',
            overflow: 'hidden',
          }}
        >
          {use3d ? (
            <Suspense fallback={<div style={{ position: 'absolute', inset: 0, padding: 24 }}><StaticGraph /></div>}>
              <MoneyGraph3DCanvas />
            </Suspense>
          ) : (
            <div style={{ position: 'absolute', inset: 0, padding: 24 }}>
              <StaticGraph />
            </div>
          )}

          {use3d && (
            <div
              style={{
                position: 'absolute',
                right: 14,
                bottom: 12,
                fontFamily: 'Barlow',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#9AA4AF',
                pointerEvents: 'none',
              }}
            >
              {t('Drag to rotate')}
            </div>
          )}
        </div>

        <Legend />
      </div>
    </section>
  );
}
