import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { consoleApi, subjectLabel } from '../api';
import { SubjectGraph } from '../components/SubjectGraph';
import { EmptyState } from '../components/EmptyState';
import { NetworkArt } from '../components/emptyArt';

export function TransactionGraph() {
  useConsoleTitle('Transaction Graph');
  const [params, setParams] = useSearchParams();
  const subject = params.get('subject') || '';
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Recent alert subjects seed the picker; deep links pass ?subject=.
  useEffect(() => {
    let alive = true;
    consoleApi.alerts().then((alerts) => {
      if (!alive) return;
      const refs = [...new Set(alerts.map((a) => a.user_ref).filter((r): r is string => !!r))].slice(0, 4);
      setSuggestions(refs);
      if (!params.get('subject') && refs[0]) setParams({ subject: refs[0] }, { replace: true });
    }).catch(() => undefined);
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {subject ? (
        <SubjectGraph subject={subject} />
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6 }}>
          <EmptyState
            illustration={<NetworkArt />}
            title="No graph subject yet"
            description={'The graph seeds from a subject: pick one from a recent alert, or follow a case’s "View money flow" link. Money flows and shared-device links expand from there.'}
          />
        </div>
      )}
    </div>
  );
}
