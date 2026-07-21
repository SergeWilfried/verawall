import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { policyBands } from '../../data/console/transactions';
import { Chip } from '../components/Chip';
import { TabButton } from '../components/TabButton';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../usePagination';
import { consoleApi, subjectLabel } from '../api';
import { SkeletonRow } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { GaugeArt } from '../components/emptyArt';
import type { DecisionRow } from '../api';
import { useApi } from '../useApi';

const PAGE_SIZE = 10;

const decisionLabel: Record<string, string> = { ALLOW: 'Approved', STEP_UP: 'Step-up', HOLD: 'Held' };
const decisionColor: Record<string, string> = { ALLOW: '#2FBF71', STEP_UP: '#E67E22', HOLD: '#D71A28' };
const scoreColor = (s: number) => (s >= 85 ? '#D71A28' : s >= 55 ? '#E67E22' : '#2FBF71');

export function TransactionRisk() {
  useConsoleTitle('Transaction Risk');
  const navigate = useNavigate();
  const [tab, setTab] = useState<'table' | 'stats'>('table');
  const [filter, setFilter] = useState<'All' | 'Held' | 'Auto'>('All');

  const { data, loading, error } = useApi(() => consoleApi.transactionRisk(), []);
  const stream = useMemo(() => data?.stream ?? [], [data]);
  const mix = data?.mix ?? { allow: 0, step_up: 0, hold: 0, total: 0 };

  const visible = filter === 'All' ? stream
    : filter === 'Held' ? stream.filter((t) => t.decision === 'HOLD')
    : stream.filter((t) => t.decision !== 'HOLD');
  const { pageItems, page, setPage, totalPages, totalItems } = usePagination(visible, PAGE_SIZE);

  const pct = (n: number) => (mix.total ? Math.round((n / mix.total) * 100) : 0);
  const amountOf = (t: DecisionRow) => {
    const a = t.txn?.amount;
    const cur = (t.txn?.currency as string) || '';
    return a != null ? `${Number(a).toLocaleString()} ${cur}`.trim() : '—';
  };

  const authMix = [
    { name: 'Approved (invisible / profile match)', n: mix.allow, color: '#2FBF71' },
    { name: 'Step-up challenge', n: mix.step_up, color: '#E67E22' },
    { name: 'Held for analyst review', n: mix.hold, color: '#D71A28' },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 16 }}>
        {[
          { label: 'Payments scored', value: mix.total.toLocaleString(), sub: 'real-time risk scoring' },
          { label: 'Approved', value: `${pct(mix.allow)}%`, sub: 'frictionless authorization' },
          { label: 'Step-up', value: `${pct(mix.step_up)}%`, sub: 'strong authentication' },
          { label: 'Held for review', value: mix.hold.toLocaleString(), sub: 'routed to analysts' },
        ].map((k) => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: '18px 20px' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A8593' }}>
              {k.label}
            </div>
            <div style={{ fontFamily: 'Barlow', fontSize: 26, fontWeight: 800, color: '#1D1D1B', marginTop: 6 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <TabButton active={tab === 'table'} onClick={() => setTab('table')}>Payment stream</TabButton>
        <TabButton active={tab === 'stats'} onClick={() => setTab('stats')}>Stats</TabButton>
      </div>

      {tab === 'table' ? (
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid #E9EDF1', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Recent scoring decisions</div>
              <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>Every /score call — adaptive risk applied only where risk demands</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {(['All', 'Held', 'Auto'] as const).map((label) => (
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
                  grid="56px minmax(0,1fr) minmax(0,1fr) 130px 120px 90px"
                  cells={[{ w: 36, h: 36, r: 3 }, {}, {}, { w: 70 }, { w: 84, h: 22, r: 11 }, { w: 44 }]}
                  padding="13px 22px"
                />
              ))}
            </div>
          )}
          {error && <div style={{ padding: '28px 22px', fontSize: 13, fontWeight: 600, color: '#D71A28' }}>{error.message}</div>}
          {!loading && !error && visible.length === 0 && (
            <EmptyState
              illustration={<GaugeArt />}
              title="No scoring decisions"
              description="Nothing recorded for this filter. Decisions appear the moment your backend calls /v1/score on a transaction."
            />
          )}

          {!loading && visible.length > 0 && (
            <>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 720 }}>
                  <div
                    style={{
                      display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) minmax(0,1fr) 130px 120px 90px',
                      padding: '10px 22px', fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: '#7A8593', borderBottom: '1px solid #E9EDF1',
                    }}
                  >
                    <div>Risk</div><div>Subject</div><div>Txn</div><div>Amount</div><div>Decision</div><div style={{ textAlign: 'right' }}>When</div>
                  </div>
                  {pageItems.map((t, i) => (
                    <div
                      key={(t.txn_ref || '') + i}
                      style={{
                        display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) minmax(0,1fr) 130px 120px 90px',
                        alignItems: 'center', padding: '13px 22px', borderBottom: '1px solid #F0F2F5',
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow', fontWeight: 800, fontSize: 13, color: '#fff', background: scoreColor(t.score) }}>
                        {t.score}
                      </div>
                      <div>
                        {t.user_ref ? (
                          <button type="button" onClick={() => navigate(`/console/customers/${t.user_ref}`)}
                            style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '12.5px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#3E4753', borderBottom: '1px dotted #C9CED4' }}
                            title={t.user_ref}>
                            {subjectLabel(t.user_ref)}
                          </button>
                        ) : <span style={{ fontSize: 12, color: '#7A8593' }}>unbound</span>}
                      </div>
                      <div style={{ fontSize: 12, color: '#5A6976', fontFamily: 'monospace' }}>{t.txn_ref || '—'}</div>
                      <div style={{ fontFamily: 'Barlow', fontWeight: 700, fontSize: '13px' }}>{amountOf(t)}</div>
                      <div><Chip color={decisionColor[t.decision]}>{decisionLabel[t.decision] || t.decision}</Chip></div>
                      <div style={{ textAlign: 'right', fontSize: '11.5px', color: '#7A8593' }}>{new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} onChange={setPage} />
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 24, alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Authentication outcomes</div>
            <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>Across all {mix.total.toLocaleString()} scored payments</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
              {authMix.map((am) => (
                <div key={am.name} style={{ fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontWeight: 600 }}>{am.name}</span>
                    <span style={{ color: '#7A8593' }}>{pct(am.n)}%</span>
                  </div>
                  <div style={{ height: 8, background: '#EEF1F4', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct(am.n)}%`, height: '100%', background: am.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: '12px 14px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4, fontSize: '12.5px', color: '#5A6976', lineHeight: 1.55 }}>
              <span style={{ fontWeight: 700, color: '#2FBF71' }}>{pct(mix.allow)}%</span> of payments authorized with zero customer friction — behavioral profile match replaced step-up authentication.
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Risk policy thresholds</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              {policyBands.map((pl) => (
                <div key={pl.band} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: pl.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{pl.band}</div>
                    <div style={{ fontSize: '11.5px', color: '#7A8593' }}>{pl.rule}</div>
                  </div>
                  <div style={{ fontFamily: 'Barlow', fontWeight: 700, fontSize: '12.5px', color: '#7A8593' }}>{pl.range}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
