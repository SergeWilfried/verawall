import { graphKinds, type GraphSubject, type GraphNodeDef } from '../data/console/graph';

export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  r: number;
  ty: number;
  ly: number;
  ly2: number;
  fill: string;
  stroke: string;
  strokeW: number;
  initials: string;
  label: string;
  sub: string;
  badge: string;
  badgeOp: number;
  bx: number;
  by: number;
  by2: number;
  hasKids: boolean;
}

export interface LayoutEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  w: number;
  dash: string;
  lx: number;
  ly: number;
  amount: string;
  labelFill: string;
}

export interface BuildGraphConfig {
  cx: number;
  cy: number;
  r1: number;
  r2: number;
  nr: number;
  showHop2: boolean;
  exp: Record<string, boolean>;
  sel: string | null;
}

function initialsOf(label: string) {
  return label
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function buildGraph(subjectKey: string, def: GraphSubject, cfg: BuildGraphConfig): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  const { cx, cy, r1, r2, nr, showHop2, exp, sel } = cfg;
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  const pos: Record<string, { x: number; y: number }> = { subject: { x: cx, y: cy } };

  const mk = (n: GraphNodeDef, x: number, y: number, r: number) => {
    const isSel = sel === n.id;
    const kids = def.nodes.filter((k) => k.parent === n.id);
    const expanded = !!exp[n.id];
    nodes.push({
      id: n.id, x, y, r, ty: y + 4, ly: y + r + 15, ly2: y + r + 28,
      fill: graphKinds[n.kind].color, stroke: isSel ? '#1D1D1B' : '#fff', strokeW: isSel ? 3 : 2,
      initials: initialsOf(n.label),
      label: n.label, sub: n.sub,
      badge: expanded ? '−' : `+${kids.length}`,
      badgeOp: showHop2 && kids.length > 0 && !n.parent ? 1 : 0,
      bx: x + r * 0.75, by: y - r * 0.75, by2: y - r * 0.75 + 3.5,
      hasKids: kids.length > 0,
    });
    pos[n.id] = { x, y };
  };

  const subjSel = sel === 'subject';
  nodes.push({
    id: 'subject', x: cx, y: cy, r: nr + 8, ty: cy + 4, ly: cy + nr + 23, ly2: cy + nr + 36,
    fill: graphKinds.subject.color, stroke: subjSel ? '#D71A28' : '#fff', strokeW: subjSel ? 3 : 2,
    initials: subjectKey.split(' ').map((w) => w[0]).join('').replace('.', ''),
    label: subjectKey, sub: 'subject', badge: '', badgeOp: 0,
    bx: 0, by: 0, by2: 0, hasKids: false,
  });

  const hop1 = def.nodes.filter((n) => !n.parent);
  hop1.forEach((n, i) => {
    const ang = ((-90 + i * (360 / hop1.length)) * Math.PI) / 180;
    mk(n, cx + r1 * Math.cos(ang), cy + r1 * Math.sin(ang), nr);
  });

  if (showHop2) {
    hop1.forEach((p, i) => {
      if (!exp[p.id]) return;
      const kids = def.nodes.filter((k) => k.parent === p.id);
      const baseAng = ((-90 + i * (360 / hop1.length)) * Math.PI) / 180;
      kids.forEach((k, j) => {
        const ang = baseAng + (j - (kids.length - 1) / 2) * 0.42;
        mk(k, cx + r2 * Math.cos(ang), cy + r2 * Math.sin(ang), nr - 5);
      });
    });
  }

  def.nodes.forEach((n) => {
    const from = pos[n.parent ?? 'subject'];
    const to = pos[n.id];
    if (!from || !to) return;
    const flagged = n.kind === 'intel' || n.kind === 'mule';
    edges.push({
      x1: from.x, y1: from.y, x2: to.x, y2: to.y,
      stroke: flagged ? '#E8B8BC' : '#D9DEE3', w: 1 + n.weight,
      dash: n.dir === 'in' ? '6 4' : '',
      lx: from.x + (to.x - from.x) * 0.55, ly: from.y + (to.y - from.y) * 0.55 - 6,
      amount: n.amount, labelFill: flagged ? '#D71A28' : '#7A8593',
    });
  });

  return { nodes, edges };
}
