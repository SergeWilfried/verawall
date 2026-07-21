import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { graphKinds, type GraphSubject, type NodeKind } from '../../data/console/graph';
import { buildGraph } from '../graphLayout';
import { GraphSvg } from '../components/GraphSvg';
import { Chip } from '../components/Chip';
import { consoleApi, subjectLabel, subjectName, type GraphResponse } from '../api';
import { Skeleton, SkeletonLines } from '../components/Skeleton';

export function TransactionGraph() {
  useConsoleTitle('Transaction Graph');
  const [params, setParams] = useSearchParams();
  const subject = params.get('subject') || '';

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [graph, setGraph] = useState<GraphResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sel, setSel] = useState('subject');
  const [exp, setExp] = useState<Record<string, boolean>>({});

  // Recent alert subjects seed the picker; deep links pass ?subject=.
  useEffect(() => {
    let alive = true;
    consoleApi.alerts().then((alerts) => {
      if (!alive) return;
      const refs = [...new Set(alerts.map((a) => a.user_ref).filter((r): r is string => !!r))].slice(0, 4);
      setSuggestions(refs);
      if (!params.get('subject') && refs[0]) {
        setParams({ subject: refs[0] }, { replace: true });
      }
    }).catch(() => undefined);
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!subject) return;
    let alive = true;
    setLoading(true);
    setError(null);
    setSel('subject');
    setExp({});
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
      // Hashed labels (subject-like refs, device-link nodes) render as
      // stable pseudonyms; tenant refs (acc-…, mule-…) stay as-is.
      nodes: graph.nodes.map((n) => ({ ...n, label: subjectName(n.label) ?? n.label })),
    };
  }, [graph]);

  const selectedNode = def && sel !== 'subject' ? def.nodes.find((n) => n.id === sel) : null;
  const selectedKind: NodeKind = selectedNode ? selectedNode.kind : 'subject';

  const layout = useMemo(() => {
    if (!def) return null;
    return buildGraph(subjectName(subject) ?? graph!.subject.label, def, {
      cx: 430, cy: 310, r1: 170, r2: 250, nr: 26, showHop2: true, exp, sel,
    });
  }, [def, graph, exp, sel]);

  const handleNodeClick = (node: { id: string; hasKids: boolean }) => {
    if (node.hasKids && node.id !== 'subject') {
      setExp((cur) => ({ ...cur, [node.id]: !cur[node.id] }));
    }
    setSel(node.id);
  };

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D71A28' }}>
            Link analysis
          </div>
          <div style={{ fontSize: 13, color: '#5A6976', marginTop: 4 }}>
            Money flow and device links around a subject, from live ledger and session data. Click a node to inspect; badged nodes expand one hop further.
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {suggestions.map((ref) => (
            <button
              key={ref}
              type="button"
              onClick={() => setParams({ subject: ref })}
              title={ref}
              style={{
                padding: '7px 14px', borderRadius: 3, border: `1px solid ${subject === ref ? '#D71A28' : '#E0E5EA'}`,
                background: subject === ref ? '#D71A28' : '#fff', color: subject === ref ? '#fff' : '#5A6976',
                fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {subjectLabel(ref)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#FBF1F2', border: '1px solid #F2D9DB', borderRadius: 4, fontSize: 13, color: '#B02A37' }}>
          {error}
        </div>
      )}
      {!error && !subject && (
        <div style={{ padding: '12px 16px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4, fontSize: 13, color: '#5A6976' }}>
          No subjects with alerts yet — the graph seeds from an alert subject or a case's "View money flow" link.
        </div>
      )}

      {loading && !def && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 10 }}>
            <Skeleton h={620} r={4} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <Skeleton w={120} h={16} />
                <Skeleton w={110} h={22} r={11} />
              </div>
              <SkeletonLines n={3} gap={16} />
            </div>
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <Skeleton w={70} h={15} style={{ marginBottom: 16 }} />
              <SkeletonLines n={4} gap={12} />
            </div>
          </div>
        </div>
      )}

      {def && layout && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 20, alignItems: 'start', opacity: loading ? 0.5 : 1 }}>
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 10 }}>
            <GraphSvg nodes={layout.nodes} edges={layout.edges} width={860} height={620} onNodeClick={handleNodeClick} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700, wordBreak: 'break-all' }} title={subject}>
                  {selectedNode ? selectedNode.label : (subjectName(subject) ?? graph!.subject.label)}
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
          </div>
        </div>
      )}
    </div>
  );
}
