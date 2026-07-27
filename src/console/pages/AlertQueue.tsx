import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { useAuth } from '../auth';
import { typeColors } from '../../data/console/alerts';
import type { ThreatType } from '../../data/console/types';
import { ScoreBadge } from '../components/ScoreBadge';
import { Chip } from '../components/Chip';
import { TabButton } from '../components/TabButton';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../usePagination';
import { consoleApi, shortRef, subjectLabel } from '../api';
import type { ServerAlert, TeamMember } from '../api';
import { SkeletonRow } from '../components/Skeleton';
import { EmptyState, SuggestChip } from '../components/EmptyState';
import { ShieldClearArt } from '../components/emptyArt';
import { useApi } from '../useApi';

const PAGE_SIZE = 8;

const filterMap: Record<string, string[]> = {
  Scams: ['APP Scam', 'Phishing', 'Commission Fraud'],
  ATO: ['Account Takeover'],
  Mules: ['Money Mule'],
};

const threatColor = (t: string | null) =>
  (t && typeColors[t as ThreatType]) || '#7A8593';

const GRID = '56px 78px minmax(0,0.9fr) 118px minmax(0,1.05fr) 88px 120px';

const nameFromEmail = (email: string) => (email || '').split('@')[0].replace(/[._-]+/g, ' ').trim();
const initialsOf = (email: string) => {
  const n = nameFromEmail(email);
  const parts = n.split(' ').filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? parts[0]?.[1] ?? '')).toUpperCase() || '?';
};

// Who's working this alert — an avatar when owned, a faint dash when free.
function OwnerCell({ assignee, mine }: { assignee?: string | null; mine: boolean }) {
  if (!assignee) return <span style={{ color: '#C9CED4', fontSize: 13 }}>—</span>;
  return (
    <span
      title={assignee}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, borderRadius: '50%',
        background: mine ? '#D71A28' : '#E9EDF1', color: mine ? '#fff' : '#5A6976',
        fontFamily: 'Barlow', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.02em',
      }}
    >
      {initialsOf(assignee)}
    </span>
  );
}

// Per-row triage menu: assign/unassign, snooze, dismiss. Actions run against
// the server then the parent reloads the queue.
function RowActions({ al, mine, onAct, team, myEmail }: {
  al: ServerAlert; mine: boolean; onAct: (fn: () => Promise<unknown>) => void;
  team: TeamMember[]; myEmail?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  const run = (fn: () => Promise<unknown>) => { setOpen(false); onAct(fn); };
  const item: React.CSSProperties = {
    display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', background: 'none',
    border: 'none', cursor: 'pointer', fontFamily: 'Barlow', fontSize: '12px', fontWeight: 600, color: '#3E4753',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Alert actions"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 30, height: 30, borderRadius: 3, border: '1px solid #E0E5EA', background: open ? '#F2F4F6' : '#fff',
          color: '#5A6976', cursor: 'pointer', fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ⋯
      </button>
      {open && (
        <div role="menu" style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 168, zIndex: 30,
          background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, boxShadow: '0 4px 10px rgba(30,38,46,0.12)', overflow: 'hidden',
        }}>
          <button type="button" role="menuitem" style={item}
            onClick={() => run(() => consoleApi.assignAlert(al.id, mine ? '' : undefined))}>
            {mine ? 'Unassign' : 'Assign to me'}
          </button>
          {al.assignee && !mine && (
            <button type="button" role="menuitem" style={{ ...item, borderTop: '1px solid #F0F2F5' }}
              onClick={() => run(() => consoleApi.assignAlert(al.id, ''))}>
              Unassign
            </button>
          )}
          {team.length > 0 && (
            <>
              <div style={{ fontFamily: 'Barlow', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9AA4AF', padding: '10px 14px 4px', borderTop: '1px solid #F0F2F5' }}>
                Assign to
              </div>
              <div style={{ maxHeight: 168, overflowY: 'auto' }}>
                {team.filter((mem) => mem.email !== myEmail).map((mem) => (
                  <button key={mem.id} type="button" role="menuitem"
                    style={{ ...item, borderTop: 'none', alignItems: 'center', display: 'flex', gap: 8 }}
                    onClick={() => run(() => consoleApi.assignAlert(al.id, mem.email))}>
                    <span style={{ display: 'inline-flex', width: 20, height: 20, borderRadius: '50%', background: al.assignee === mem.email ? '#D71A28' : '#E9EDF1', color: al.assignee === mem.email ? '#fff' : '#5A6976', fontFamily: 'Barlow', fontWeight: 700, fontSize: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {mem.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mem.name}</span>
                    {al.assignee === mem.email && <span style={{ marginLeft: 'auto', color: '#D71A28', fontSize: 11 }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
          <button type="button" role="menuitem" style={{ ...item, borderTop: '1px solid #F0F2F5' }}
            onClick={() => run(() => consoleApi.snoozeAlert(al.id, 60))}>
            {al.snoozed ? 'Snooze +1 hour' : 'Snooze 1 hour'}
          </button>
          <button type="button" role="menuitem" style={{ ...item, borderTop: '1px solid #F0F2F5', color: '#D71A28' }}
            onClick={() => run(() => consoleApi.patchAlert(al.id, { state: 'Dismissed', disposition: 'Dismissed from queue.' }))}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

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
  const subjectFilter = searchParams.get('subject');

  const { session } = useAuth();
  const [tab, setTab] = useState<'queue' | 'stats'>('queue');
  const [filter, setFilter] = useState<'All' | 'Scams' | 'ATO' | 'Mules'>('All');
  // When scoped to a subject (from their profile), show every state — the point
  // is that subject's full history, not just what's currently open.
  const [stateFilter, setStateFilter] = useState<'Open' | 'all'>(subjectFilter ? 'all' : 'Open');
  const [sort, setSort] = useState<'risk' | 'newest' | 'oldest'>('risk');
  const [mineOnly, setMineOnly] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const isAdmin = (session?.rank ?? 0) >= 3;

  // Admins can assign to any teammate — load the roster once for the picker.
  const [team, setTeam] = useState<TeamMember[]>([]);
  useEffect(() => {
    if (!isAdmin) return;
    let alive = true;
    consoleApi.team().then((t) => { if (alive) setTeam(t.filter((m) => !m.disabled)); }).catch(() => {});
    return () => { alive = false; };
  }, [isAdmin]);

  const { data, loading, error, reload } = useApi<ServerAlert[]>(
    () => consoleApi.alerts(stateFilter === 'Open' ? 'Open' : undefined),
    [stateFilter],
  );
  const alerts = useMemo(() => data ?? [], [data]);
  const isMine = (a: ServerAlert) => !!a.assignee && !!session && a.assignee === session.email;

  // Run a triage action, then refresh the queue.
  const act = (fn: () => Promise<unknown>) => {
    setBusy('x');
    fn().then(() => reload()).catch(() => {}).finally(() => setBusy(null));
  };

  let visible = typeFilter ? alerts.filter((a) => a.threat_type === typeFilter) : alerts;
  if (subjectFilter) visible = visible.filter((a) => a.user_ref === subjectFilter);
  if (filter !== 'All') visible = visible.filter((a) => a.threat_type && filterMap[filter].includes(a.threat_type));
  if (mineOnly) visible = visible.filter(isMine);
  const mineCount = alerts.filter(isMine).length;

  // Default to highest-risk-first — the triage order an analyst wants.
  const sorted = useMemo(() => {
    const ts = (a: ServerAlert) => new Date(a.created_at).getTime();
    const copy = [...visible];
    if (sort === 'risk') copy.sort((a, b) => b.score - a.score || ts(b) - ts(a));
    else if (sort === 'newest') copy.sort((a, b) => ts(b) - ts(a));
    else copy.sort((a, b) => ts(a) - ts(b));
    return copy;
  }, [visible, sort]);

  const { pageItems, page, setPage, totalPages, totalItems } = usePagination(sorted, PAGE_SIZE);

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

      {subjectFilter && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#FDF3F4', border: '1px solid #F3D2D6', borderRadius: 6 }}>
          <span style={{ fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#A21622' }}>Scoped to subject</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1E262E' }} title={subjectFilter}>{subjectLabel(subjectFilter)}</span>
          <button
            type="button"
            onClick={() => navigate('/console/alerts')}
            style={{ marginLeft: 'auto', padding: '5px 12px', background: '#fff', border: '1px solid #F3D2D6', borderRadius: 3, color: '#A21622', fontFamily: 'Barlow', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Clear ✕
          </button>
        </div>
      )}

      {tab === 'queue' ? (
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid #E9EDF1', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>
              {stateFilter === 'Open' ? 'Open alerts' : 'All alerts'}
              <span style={{ fontWeight: 600, color: '#7A8593' }}> · {visible.length}</span>
            </div>
            <button
              type="button"
              aria-pressed={mineOnly}
              onClick={() => setMineOnly((m) => !m)}
              style={{
                padding: '7px 14px', borderRadius: 3, border: `1px solid ${mineOnly ? '#D71A28' : '#E0E5EA'}`,
                background: mineOnly ? '#D71A28' : '#fff', color: mineOnly ? '#fff' : '#5A6976',
                fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Mine · {mineCount}
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', border: '1px solid #E0E5EA', borderRadius: 3, overflow: 'hidden' }} role="group" aria-label="Sort alerts">
                {([['risk', 'Risk'], ['newest', 'Newest'], ['oldest', 'Oldest']] as const).map(([v, lab], i) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={sort === v}
                    onClick={() => setSort(v)}
                    style={{
                      padding: '7px 12px', border: 'none', borderLeft: i > 0 ? '1px solid #E0E5EA' : 'none',
                      background: sort === v ? '#F2F4F6' : '#fff', color: sort === v ? '#1E262E' : '#7A8593',
                      fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em',
                      textTransform: 'uppercase', cursor: 'pointer',
                    }}
                  >
                    {lab}
                  </button>
                ))}
              </div>
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
                  grid={GRID}
                  cells={[{ w: 36, h: 36, r: 3 }, { w: 56 }, {}, { w: 110, h: 22, r: 11 }, {}, { w: 26, h: 26, r: 13 }, { w: 100, h: 30, r: 3 }]}
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
              <div style={{ overflowX: 'auto', opacity: busy ? 0.6 : 1, transition: 'opacity 0.1s' }}>
                <div style={{ minWidth: 840 }}>
                  <div
                    style={{
                      display: 'grid', gridTemplateColumns: GRID,
                      padding: '10px 22px', fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: '#7A8593', borderBottom: '1px solid #E9EDF1',
                    }}
                  >
                    <div>Risk</div><div>Alert</div><div>Subject</div><div>Threat type</div><div>Signal</div><div>Owner</div><div style={{ textAlign: 'right' }}>Actions</div>
                  </div>
                  {pageItems.map((al) => (
                    <div
                      key={al.id}
                      style={{
                        display: 'grid', gridTemplateColumns: GRID,
                        alignItems: 'center', padding: '14px 22px', borderBottom: '1px solid #F0F2F5',
                        background: isMine(al) ? '#FDF9F9' : undefined,
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
                      <div><OwnerCell assignee={al.assignee} mine={isMine(al)} /></div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
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
                        <RowActions al={al} mine={isMine(al)} onAct={act} team={team} myEmail={session?.email} />
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
