import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { typeColors } from '../../data/console/alerts';
import type { ThreatType } from '../../data/console/types';
import { ScoreBadge } from '../components/ScoreBadge';
import { Chip } from '../components/Chip';
import { TabButton } from '../components/TabButton';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../usePagination';
import { consoleApi, shortRef, subjectLabel } from '../api';
import type { ServerAlert } from '../api';
import { SkeletonRow } from '../components/Skeleton';
import { EmptyState, SuggestChip } from '../components/EmptyState';
import { ShieldClearArt } from '../components/emptyArt';
import { useApi } from '../useApi';

const PAGE_SIZE = 8;

const filterMap: Record<string, string[]> = {
  Scams: ['APP Scam', 'Phishing', 'Agent Commission Fraud'],
  ATO: ['Account Takeover'],
  Mules: ['Money Mule'],
};

const threatColor = (t: string | null) =>
  (t && typeColors[t as ThreatType]) || '#7A8593';

// The queue is scanned, not read: show the two defining signals as chips and
// roll the rest into "+N", with the full stack on hover. The complete list
// lives in Alert Review.
function SignalCell({ signal }: { signal: string }) {
  const parts = (signal || '').split(' + ').map((s) => s.trim()).filter(Boolean);
  const shown = parts.slice(0, 2);
  const extra = parts.length - shown.length;
  if (parts.length === 0) {
    return <div style={{ fontSize: '12px', color: '#9AA4AF' }}>—</div>;
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }} title={parts.join(' · ')}>
      {shown.map((s) => (
        <span
          key={s}
          style={{
            fontSize: '11px', lineHeight: 1.3, color: '#3E4753', background: '#F2F4F6',
            border: '1px solid #E4E8EC', borderRadius: 4, padding: '2px 7px',
            maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {s}
        </span>
      ))}
      {extra > 0 && (
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#7A8593', whiteSpace: 'nowrap' }}>
          +{extra} more
        </span>
      )}
    </div>
  );
}

export function AlertQueue() {
  useConsoleTitle('Alert Queue');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get('type');

  const [tab, setTab] = useState<'queue' | 'stats'>('queue');
  const [filter, setFilter] = useState<'All' | 'Scams' | 'ATO' | 'Mules'>('All');
  const [stateFilter, setStateFilter] = useState<'Open' | 'all'>('Open');

  const { data, loading, error } = useApi<ServerAlert[]>(
    () => consoleApi.alerts(stateFilter === 'Open' ? 'Open' : undefined),
    [stateFilter],
  );
  const alerts = useMemo(() => data ?? [], [data]);

  let visible = typeFilter ? alerts.filter((a) => a.threat_type === typeFilter) : alerts;
  if (filter !== 'All') visible = visible.filter((a) => a.threat_type && filterMap[filter].includes(a.threat_type));

  const { pageItems, page, setPage, totalPages, totalItems } = usePagination(visible, PAGE_SIZE);

  // Threat mix, computed from the live queue.
  const threatMix = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of alerts) {
      const t = a.threat_type || 'Unclassified';
      counts.set(t, (counts.get(t) || 0) + 1);
    }
    return [...counts.entries()].map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [alerts]);
  const maxThreat = Math.max(1, ...threatMix.map((t) => t.count));

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <TabButton active={tab === 'queue'} onClick={() => setTab('queue')}>Alert queue</TabButton>
        <TabButton active={tab === 'stats'} onClick={() => setTab('stats')}>Threat mix</TabButton>
      </div>

      {tab === 'queue' ? (
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid #E9EDF1', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>
              {stateFilter === 'Open' ? 'Open alerts' : 'All alerts'}
              <span style={{ fontWeight: 600, color: '#7A8593' }}> · {visible.length}</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setStateFilter((s) => (s === 'Open' ? 'all' : 'Open'))}
                style={{
                  padding: '7px 14px', borderRadius: 3, border: '1px solid #E0E5EA', background: '#fff',
                  color: '#5A6976', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                {stateFilter === 'Open' ? 'Show all states' : 'Open only'}
              </button>
              {(['All', 'Scams', 'ATO', 'Mules'] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFilter(label)}
                  style={{
                    padding: '7px 14px', borderRadius: 3, border: `1px solid ${filter === label ? '#D71A28' : '#E0E5EA'}`,
                    background: filter === label ? '#D71A28' : '#fff', color: filter === label ? '#fff' : '#5A6976',
                    fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div>
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonRow
                  key={i}
                  seed={i}
                  grid="64px 96px minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.4fr) 92px"
                  cells={[{ w: 36, h: 36, r: 3 }, { w: 60 }, {}, { w: 120, h: 22, r: 11 }, {}, { w: 70, h: 30, r: 3 }]}
                />
              ))}
            </div>
          )}
          {error && (
            <div style={{ padding: '28px 22px', fontSize: 13, fontWeight: 600, color: '#D71A28' }}>
              {error.message}
            </div>
          )}
          {!loading && !error && visible.length === 0 && (
            <EmptyState
              illustration={<ShieldClearArt />}
              eyebrow="All clear"
              eyebrowColor="#2FBF71"
              title="Queue is clear"
              description={`No ${stateFilter === 'Open' ? 'open ' : ''}alerts match this filter. Alerts appear here when the scoring engine holds a payment or the ledger detector flags an account.`}
              suggestedActions={
                <>
                  {stateFilter === 'Open' && (
                    <SuggestChip onClick={() => setStateFilter('all')}>Show all states</SuggestChip>
                  )}
                  {(filter !== 'All' || typeFilter) && (
                    <SuggestChip onClick={() => { setFilter('All'); navigate('/console/alerts'); }}>Clear filters</SuggestChip>
                  )}
                </>
              }
            />
          )}

          {!loading && !error && visible.length > 0 && (
            <>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 760 }}>
                  <div
                    style={{
                      display: 'grid', gridTemplateColumns: '64px 96px minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.4fr) 92px',
                      padding: '10px 22px', fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: '#7A8593', borderBottom: '1px solid #E9EDF1',
                    }}
                  >
                    <div>Risk</div><div>Alert</div><div>Subject</div><div>Threat type</div><div>Signal</div><div style={{ textAlign: 'right' }}>Action</div>
                  </div>
                  {pageItems.map((al) => (
                    <div
                      key={al.id}
                      style={{
                        display: 'grid', gridTemplateColumns: '64px 96px minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.4fr) 92px',
                        alignItems: 'center', padding: '14px 22px', borderBottom: '1px solid #F0F2F5',
                      }}
                    >
                      <ScoreBadge score={al.score} />
                      <div style={{ fontFamily: 'Barlow', fontSize: '12.5px', fontWeight: 700, color: '#1E262E' }}>{al.id}</div>
                      <div>
                        {al.user_ref ? (
                          <button
                            type="button"
                            onClick={() => navigate(`/console/customers/${al.user_ref}`)}
                            style={{
                              fontWeight: 700, fontSize: '12.5px', fontFamily: 'monospace', background: 'none', border: 'none',
                              cursor: 'pointer', padding: 0, color: '#3E4753', borderBottom: '1px dotted #C9CED4', textAlign: 'left',
                            }}
                            title={al.user_ref}
                          >
                            {subjectLabel(al.user_ref)}
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: '#7A8593', fontFamily: 'monospace' }}>
                            {al.account_ref ? shortRef(al.account_ref) : 'no subject'}
                          </span>
                        )}
                      </div>
                      <div><Chip color={threatColor(al.threat_type)}>{al.threat_type || 'Unclassified'}</Chip></div>
                      <SignalCell signal={al.signal} />
                      <div style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/console/alerts/${al.id}`)}
                          style={{
                            padding: '8px 14px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3,
                            fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} onChange={setPage} />
            </>
          )}
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22, maxWidth: 560 }}>
          <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Threat mix — current queue</div>
          <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>Distribution of {alerts.length} alerts by classification</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
            {threatMix.length === 0 && <div style={{ fontSize: '12.5px', color: '#7A8593' }}>No alerts to summarize.</div>}
            {threatMix.map((tm) => (
              <div key={tm.name} style={{ fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>{tm.name}</span>
                  <span style={{ color: '#7A8593' }}>{tm.count}</span>
                </div>
                <div style={{ height: 8, background: '#EEF1F4', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.round((tm.count / maxThreat) * 100)}%`, height: '100%',
                      background: threatColor(tm.name), borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
