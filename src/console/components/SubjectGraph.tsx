// Follow-the-money link-analysis graph for a single subject. Self-contained:
// fetches the graph, lays it out, and handles node selection/expansion. Used
// both on the Transaction Graph page and inline in a Transaction Risk detail.
import { useEffect, useMemo, useState } from 'react';
import { graphKinds, type GraphSubject, type NodeKind } from '../../data/console/graph';
import { buildGraph } from '../graphLayout';
import { GraphSvg } from './GraphSvg';
import { Chip } from './Chip';
import { Skeleton, SkeletonLines } from './Skeleton';
import { consoleApi, subjectName, type GraphResponse } from '../api';

interface Props {
  subject: string;
  width?: number;
  height?: number;
  showLegend?: boolean;
}

export function SubjectGraph({ subject, width = 860, height = 620, showLegend = true }: Props) {
  const [graph, setGraph] = useState<GraphResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sel, setSel] = useState('subject');
  const [exp, setExp] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!subject) return;
    let alive = true;
    setLoading(true); setError(null); setSel('subject'); setExp({}); setGraph(null);
    consoleApi.graph(subject)
      .then((g) => { if (alive) setGraph(g); })
      .catch((e) => { if (alive) setError(e instanceof Error ? e.message : 'Could not load graph.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [subject]);

  const def: GraphSubject | null = useMemo(() => {
    if (!graph) return null;
    return {
      sub: graph.subject.sub,
      stats: graph.subject.stats,
      flags: graph.subject.flags ?? [],
      // Hashed labels (subject-like refs, device-link nodes) render as stable
      // pseudonyms; tenant refs (acc-…, mule-…) stay as-is.
      nodes: graph.nodes.map((n) => ({ ...n, label: subjectName(n.label) ?? n.label })),
    };
  }, [graph]);

  const selectedNode = def && sel !== 'subject' ? def.nodes.find((n) => n.id === sel) : null;
  const selectedKind: NodeKind = selectedNode ? selectedNode.kind : 'subject';

  const layout = useMemo(() => {
    if (!def || !graph) return null;
    // Scale the orbit radii to the canvas so a compact embed doesn't clip
    // hop-2 nodes (the page keeps the original 170/250 at 620px tall).
    const r1 = Math.min(170, height * 0.28);
    const r2 = Math.min(250, height * 0.42);
    const nr = Math.min(26, Math.round(height / 24));
    return buildGraph(subjectName(subject) ?? graph.subject.label, def, {
      cx: width / 2, cy: height / 2, r1, r2, nr, showHop2: true, exp, sel,
    });
  }, [def, graph, exp, sel, subject, width, height]);

  const handleNodeClick = (node: { id: string; hasKids: boolean }) => {
    if (node.hasKids && node.id !== 'subject') setExp((cur) => ({ ...cur, [node.id]: !cur[node.id] }));
    setSel(node.id);
  };

  if (error) {
    return (
      <div style={{ padding: '12px 16px', background: '#FBF1F2', border: '1px solid #F2D9DB', borderRadius: 4, fontSize: 13, color: '#B02A37' }}>
        {error}
      </div>
    );
  }

  if (loading && !def) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 10 }}>
          <Skeleton h={height} r={4} />
        </div>
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <Skeleton w={120} h={16} /><Skeleton w={110} h={22} r={11} />
          </div>
          <SkeletonLines n={3} gap={16} />
        </div>
      </div>
    );
  }

  if (!def || !layout || !graph) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 20, alignItems: 'start', opacity: loading ? 0.5 : 1 }}>
      <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 10 }}>
        <GraphSvg nodes={layout.nodes} edges={layout.edges} width={width} height={height} onNodeClick={handleNodeClick} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700, wordBreak: 'break-all' }} title={subject}>
              {selectedNode ? selectedNode.label : (subjectName(subject) ?? graph.subject.label)}
            </div>
            <Chip color={graphKinds[selectedKind].color}>{graphKinds[selectedKind].name}</Chip>
          </div>
          <div style={{ fontSize: '12.5px', color: '#7A8593', marginTop: 4 }}>{selectedNode ? selectedNode.sub : def.sub}</div>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
            {(selectedNode ? selectedNode.stats : def.stats)?.map((sv) => (
              <div key={sv.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '8px 0', borderBottom: '1px solid #F0F2F5', fontSize: '12.5px' }}>
                <span style={{ color: '#7A8593', whiteSpace: 'nowrap' }}>{sv.k}</span>
                <span style={{ fontWeight: 700, textAlign: 'right' }}>{sv.v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {(selectedNode ? selectedNode.flags : def.flags)?.map((text) => (
              <div key={text} style={{ display: 'flex', gap: 9, fontSize: 12, lineHeight: 1.5, padding: '9px 11px', background: '#FBF1F2', border: '1px solid #F2D9DB', borderRadius: 4, color: '#5A6976' }}>
                <span style={{ color: '#D71A28', fontWeight: 800 }}>!</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {showLegend && (
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Legend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {(Object.keys(graphKinds) as NodeKind[]).map((key) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '12.5px' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: graphKinds[key].color, flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>{graphKinds[key].name}</span>
                  <span style={{ color: '#7A8593', marginLeft: 'auto', fontSize: '11.5px' }}>{graphKinds[key].desc}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '11px 13px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4, fontSize: '11.5px', color: '#7A8593', lineHeight: 1.5 }}>
              Edge thickness = transferred amount. Dashed edges = inbound to the subject. Graphs are seeded from a subject and expand on demand — never the full ledger. Second-hop expansion covers in-book accounts only.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
