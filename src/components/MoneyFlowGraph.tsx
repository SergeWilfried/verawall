// Follow-the-money graph for the money-mules page — a 2D animated SVG (no
// heavy dependency). Green victim payment → ink mule hub → red cash-out mules
// → amber next hops, with a dashed shared-device link. Small pulses travel the
// carrying edges to show direction of flow; per-node labels and split amounts
// make the story explicit. The SVG scales to its container, so it is
// responsive with no layout JS. Respects prefers-reduced-motion: no pulses, no
// ring animation — the same graph, held still.

import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';

const RED = '#D71A28';
const GREEN = '#1E9E5A';
const INK = '#1E262E';
const AMBER = '#C67C00';
const LINE = '#E3E7EB';
const MUTED = '#5A6976';
const FAINT = '#8A94A0';

type Anchor = 'start' | 'middle' | 'end';
interface Node {
  id: string;
  x: number;
  y: number;
  r: number;
  color: number | string;
  label?: string;
  lx?: number;
  ly?: number;
  anchor?: Anchor;
}
interface Edge {
  a: string;
  b: string;
  kind: 'in' | 'out' | 'hop' | 'device';
  amount?: number; // shown at the edge midpoint
}

const NODES: Node[] = [
  { id: 'victim', x: 70, y: 235, r: 15, color: GREEN, label: 'Victim', lx: 70, ly: 205, anchor: 'middle' },
  { id: 'mule', x: 380, y: 235, r: 27, color: INK, label: 'Mule account', lx: 380, ly: 292, anchor: 'middle' },
  { id: 'o1', x: 610, y: 110, r: 13, color: RED, label: 'Cash-out', lx: 610, ly: 84, anchor: 'middle' },
  { id: 'o2', x: 660, y: 235, r: 14, color: RED },
  { id: 'o3', x: 610, y: 360, r: 12, color: RED, label: 'Cash-out', lx: 610, ly: 388, anchor: 'middle' },
  { id: 'o4', x: 480, y: 405, r: 11, color: RED },
  { id: 'o5', x: 480, y: 65, r: 11, color: RED },
  { id: 'h1', x: 828, y: 95, r: 9, color: AMBER },
  { id: 'h2', x: 862, y: 238, r: 9, color: AMBER, label: 'Next hop', lx: 862, ly: 268, anchor: 'end' },
  { id: 'h3', x: 828, y: 380, r: 9, color: AMBER },
];

const EDGES: Edge[] = [
  { a: 'victim', b: 'mule', kind: 'in', amount: 90000 },
  { a: 'mule', b: 'o1', kind: 'out', amount: 18000 },
  { a: 'mule', b: 'o2', kind: 'out', amount: 22000 },
  { a: 'mule', b: 'o3', kind: 'out', amount: 15000 },
  { a: 'mule', b: 'o4', kind: 'out' },
  { a: 'mule', b: 'o5', kind: 'out' },
  { a: 'o1', b: 'h1', kind: 'hop' },
  { a: 'o2', b: 'h2', kind: 'hop' },
  { a: 'o3', b: 'h3', kind: 'hop' },
  { a: 'o2', b: 'o3', kind: 'device' },
];

const EDGE_COLOR = { in: GREEN, out: RED, hop: AMBER, device: '#9AA4AF' } as const;
const byId = (id: string) => NODES.find((n) => n.id === id)!;

export function MoneyFlowGraph({ title }: { title: string }) {
  const { t, lang } = useLanguage();
  const isMobile = useIsMobile();
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const flowEdges = EDGES.filter((e) => e.kind !== 'device');
  const fmt = (n: number) => n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US');

  useEffect(() => {
    // No animation for reduced-motion viewers — the graph is fully legible held
    // still (labels + amounts carry the story).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let running = true;
    const start = performance.now();
    const paths = flowEdges.map((e, i) => {
      const a = byId(e.a);
      const b = byId(e.b);
      return { ax: a.x, ay: a.y, bx: b.x, by: b.y, phase: (i * 0.13) % 1 };
    });

    const loop = (now: number) => {
      if (!running) return;
      const el = (now - start) / 1000;
      for (let i = 0; i < paths.length; i++) {
        const c = pulseRefs.current[i];
        if (!c) continue;
        const p = paths[i];
        const tt = (el * 0.32 + p.phase) % 1;
        c.setAttribute('cx', String(p.ax + (p.bx - p.ax) * tt));
        c.setAttribute('cy', String(p.ay + (p.by - p.ay) * tt));
        c.setAttribute('opacity', String(Math.sin(tt * Math.PI)));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      running = document.visibilityState === 'visible';
      if (running) raf = requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      running = false;
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [flowEdges]);

  return (
    <section style={{ background: '#FBFBFC', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '48px 15px' : '72px 15px' }}>
        <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700, textAlign: 'center', textWrap: 'balance' }}>{t(title)}</h2>
        <p style={{ fontSize: 17, color: MUTED, textAlign: 'center', maxWidth: 640, margin: '18px auto 0', lineHeight: 1.7 }}>
          {t('One mule account rarely acts alone. VeraWall traces the flow from the victim payment through the cash-out network — the same graph an analyst opens on a confirmed alert.')}
        </p>

        <div
          style={{
            marginTop: isMobile ? 24 : 40,
            background: '#fff',
            border: `1px solid ${LINE}`,
            borderRadius: 12,
            boxShadow: '0 20px 50px rgba(20,30,40,0.10)',
            padding: isMobile ? 12 : 20,
          }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 900 470"
            width="100%"
            style={{ display: 'block', height: 'auto' }}
            role="img"
            aria-label={t('Follow-the-money graph: a 90,000 victim payment into a mule account, split across cash-out mules and forwarded to exchanges and cards. Two mules share a device.')}
          >
            {/* edges */}
            {EDGES.map((e, i) => {
              const a = byId(e.a);
              const b = byId(e.b);
              const dashed = e.kind === 'device';
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={EDGE_COLOR[e.kind]}
                  strokeWidth={2}
                  strokeOpacity={dashed ? 0.7 : 0.5}
                  strokeDasharray={dashed ? '6 5' : undefined}
                />
              );
            })}

            {/* hub pulse ring + static ring */}
            <circle className="vw-ring-pulse" cx={byId('mule').x} cy={byId('mule').y} r={38} fill="none" stroke={RED} strokeWidth={2} />
            <circle cx={byId('mule').x} cy={byId('mule').y} r={38} fill="none" stroke={RED} strokeWidth={1.5} strokeOpacity={0.25} />

            {/* flow pulses */}
            {flowEdges.map((e, i) => (
              <circle
                key={`p${i}`}
                ref={(el) => {
                  pulseRefs.current[i] = el;
                }}
                r={4.5}
                fill={EDGE_COLOR[e.kind]}
                cx={byId(e.a).x}
                cy={byId(e.a).y}
                opacity={0}
              />
            ))}

            {/* edge amount labels */}
            {EDGES.filter((e) => e.amount).map((e, i) => {
              const a = byId(e.a);
              const b = byId(e.b);
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              return (
                <text key={`amt${i}`} x={mx} y={my - 7} textAnchor="middle" fontFamily="Barlow" fontSize={13} fontWeight={700} fill={e.kind === 'in' ? GREEN : RED} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(e.amount!)}
                </text>
              );
            })}

            {/* nodes */}
            {NODES.map((n) => (
              <circle key={n.id} cx={n.x} cy={n.y} r={n.r} fill={typeof n.color === 'number' ? '#' + n.color.toString(16) : n.color} />
            ))}

            {/* node labels */}
            {NODES.filter((n) => n.label).map((n) => (
              <text
                key={`l${n.id}`}
                x={n.lx}
                y={n.ly}
                textAnchor={n.anchor ?? 'middle'}
                fontFamily="Barlow"
                fontSize={n.id === 'mule' ? 15 : 13}
                fontWeight={n.id === 'mule' ? 800 : 700}
                fill={n.id === 'mule' ? INK : MUTED}
              >
                {t(n.label!)}
              </text>
            ))}
          </svg>

          {/* the mule signal, as a chip under the graph */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: isMobile ? 4 : 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 7, padding: '7px 12px 7px 7px', boxShadow: '0 8px 20px rgba(20,30,40,0.08)' }}>
              <span style={{ fontFamily: 'Barlow', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', color: '#fff', background: RED, borderRadius: 4, padding: '3px 6px' }}>{t('HIGH')}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{t('Rapid in-out · 11 min · fan-out to 5 accounts')}</span>
            </span>
          </div>
        </div>

        {/* legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 18 }}>
          {([[GREEN, 'Victim payment'], [INK, 'Mule account'], [RED, 'Cash-out mules'], [AMBER, 'Next hop']] as [string, string][]).map(([c, label]) => (
            <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: MUTED }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: c }} />
              {t(label)}
            </span>
          ))}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: FAINT }}>
            <span style={{ width: 16, height: 0, borderTop: '2px dashed #9AA4AF' }} />
            {t('Shared device')}
          </span>
        </div>
      </div>
    </section>
  );
}
