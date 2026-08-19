import { useEffect, useRef } from 'react';
import type { LayoutEdge, LayoutNode } from '../graphLayout';

// The console link-analysis graph. Nodes/edges are laid out by graphLayout and
// rendered here. On top of the static graph, a subtle directional flow pulse
// travels each edge the way the money moved (out = away from the parent, in =
// toward the subject) — the same "labelled-flow" treatment as the marketing
// money-mules graph, but restrained for the analyst working surface and fully
// gated by prefers-reduced-motion. The pulse is informational (it shows flow
// direction at a glance); labels and amounts already come from the layout.
export function GraphSvg({
  nodes,
  edges,
  width,
  height,
  onNodeClick,
}: {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  width: number;
  height: number;
  onNodeClick?: (node: LayoutNode) => void;
}) {
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  // Flow geometry, oriented in the direction money moved. Rebuilt every render
  // so the RAF stays in sync with expand/collapse and selection changes.
  const flow = edges.map((e, i) => {
    const [ax, ay, bx, by] = e.dir === 'in' ? [e.x2, e.y2, e.x1, e.y1] : [e.x1, e.y1, e.x2, e.y2];
    return { ax, ay, bx, by, phase: (i * 0.11) % 1 };
  });
  const flowRef = useRef(flow);
  flowRef.current = flow;

  const subject = nodes.find((n) => n.id === 'subject');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let running = true;
    const start = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      const el = (now - start) / 1000;
      const f = flowRef.current;
      for (let i = 0; i < f.length; i++) {
        const c = pulseRefs.current[i];
        if (!c) continue;
        const p = f[i];
        const tt = (el * 0.22 + p.phase) % 1; // slow, understated
        c.setAttribute('cx', String(p.ax + (p.bx - p.ax) * tt));
        c.setAttribute('cy', String(p.ay + (p.by - p.ay) * tt));
        c.setAttribute('opacity', String(Math.sin(tt * Math.PI) * 0.7));
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
  }, []);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {edges.map((e, i) => (
        <g key={`e${i}`}>
          <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.stroke} strokeWidth={e.w} strokeDasharray={e.dash || undefined} />
          {e.amount && (
            <text x={e.lx} y={e.ly} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={e.labelFill} fontFamily="Barlow, sans-serif">
              {e.amount}
            </text>
          )}
        </g>
      ))}

      {/* flow pulses (one per edge, oriented in the money's direction) */}
      {flow.map((f, i) => (
        <circle
          key={`p${i}`}
          ref={(el) => {
            pulseRefs.current[i] = el;
          }}
          r={3.2}
          fill={edges[i].flowColor}
          cx={f.ax}
          cy={f.ay}
          opacity={0}
        />
      ))}

      {/* hub ring pulse around the subject (paused under reduced motion by CSS) */}
      {subject && (
        <circle className="vw-ring-pulse" cx={subject.x} cy={subject.y} r={subject.r + 6} fill="none" stroke="#D71A28" strokeWidth={1.5} />
      )}

      {nodes.map((n) => (
        <g key={`n${n.id}`} onClick={() => onNodeClick?.(n)} style={{ cursor: onNodeClick ? 'pointer' : 'default' }}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.fill} stroke={n.stroke} strokeWidth={n.strokeW} />
          <text x={n.x} y={n.ty} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff" fontFamily="Barlow, sans-serif">
            {n.initials}
          </text>
          <text x={n.x} y={n.ly} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#3E4753" fontFamily="Barlow, sans-serif">
            {n.label}
          </text>
          <text x={n.x} y={n.ly2} textAnchor="middle" fontSize={9.5} fill="#7A8593" fontFamily="Open Sans, sans-serif">
            {n.sub}
          </text>
          {n.badgeOp === 1 && (
            <g>
              <circle cx={n.bx} cy={n.by} r={10} fill="#1D1D1B" />
              <text x={n.bx} y={n.by2} textAnchor="middle" fontSize={10} fontWeight={800} fill="#fff" fontFamily="Barlow, sans-serif">
                {n.badge}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}
