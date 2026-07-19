import type { LayoutEdge, LayoutNode } from '../graphLayout';

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
