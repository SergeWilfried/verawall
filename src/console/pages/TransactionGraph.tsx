import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { graphDefs, graphKinds, type NodeKind } from '../../data/console/graph';
import { buildGraph } from '../graphLayout';
import { GraphSvg } from '../components/GraphSvg';
import { Chip } from '../components/Chip';
import { toSlug } from '../../data/console/slug';

export function TransactionGraph() {
  useConsoleTitle('Transaction Graph');
  const navigate = useNavigate();

  const subjects = Object.keys(graphDefs);
  const [subject, setSubject] = useState(subjects[0]);
  const [sel, setSel] = useState('subject');
  const [exp, setExp] = useState<Record<string, boolean>>({});
  const [flaggedMsg, setFlaggedMsg] = useState('');

  const def = graphDefs[subject];
  const selectedNode = sel === 'subject' ? null : def.nodes.find((n) => n.id === sel);
  const selectedKind: NodeKind = selectedNode ? selectedNode.kind : 'subject';

  const { nodes, edges } = useMemo(
    () =>
      buildGraph(subject, def, {
        cx: 430, cy: 310, r1: 170, r2: 250, nr: 26, showHop2: true, exp, sel,
      }),
    [subject, def, exp, sel],
  );

  const handleNodeClick = (node: { id: string; hasKids: boolean }) => {
    if (node.hasKids && node.id !== 'subject') {
      setExp((cur) => ({ ...cur, [node.id]: !cur[node.id] }));
    }
    setSel(node.id);
    setFlaggedMsg('');
  };

  const changeSubject = (label: string) => {
    setSubject(label);
    setSel('subject');
    setExp({});
    setFlaggedMsg('');
  };

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D71A28' }}>
            Link analysis
          </div>
          <div style={{ fontSize: 13, color: '#5A6976', marginTop: 4 }}>
            Money flow around a subject account. Click a node to inspect; nodes with a badge expand one hop further.
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {subjects.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => changeSubject(label)}
              style={{
                padding: '7px 14px', borderRadius: 3, border: `1px solid ${subject === label ? '#D71A28' : '#E0E5EA'}`,
                background: subject === label ? '#D71A28' : '#fff', color: subject === label ? '#fff' : '#5A6976',
                fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 10 }}>
          <GraphSvg nodes={nodes} edges={edges} width={860} height={620} onNodeClick={handleNodeClick} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>{selectedNode ? selectedNode.label : subject}</div>
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

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                type="button"
                onClick={() =>
                  setFlaggedMsg(
                    sel === 'subject'
                      ? '✓ Case created from graph evidence — assigned to you.'
                      : '✓ Account flagged — shared to FraudIntel and added to watchlist.',
                  )
                }
                style={{
                  flex: 1, padding: 11, background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3,
                  fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                {sel === 'subject' ? 'Create case' : 'Flag account'}
              </button>
              {sel === 'subject' && (
                <button
                  type="button"
                  onClick={() => navigate(`/console/customers/${toSlug(subject)}`)}
                  style={{
                    flex: 1, padding: 11, background: '#fff', color: '#3E4753', border: '1px solid #E0E5EA', borderRadius: 3,
                    fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  Open profile
                </button>
              )}
            </div>
            {flaggedMsg && <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: '#2FBF71' }}>{flaggedMsg}</div>}
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
              Edge thickness = transferred amount. Dashed edges = inbound to the node. Graphs are seeded from a subject and expand on demand — never the full ledger.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
