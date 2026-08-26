import { useEffect, useState } from 'react';
import { consoleApi, type AuditEntry, ApiError } from '../api';
import { useConsoleTitle } from '../TitleContext';
import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { SkeletonLines } from '../components/Skeleton';
import { roleColors } from '../../data/console/settings';

// Who did what, when — the compliance answer a bank's review asks for first.
// Server-side the trail is written at the console dispatcher (every mutating
// request) plus login/logout, so this page is a reader: no state of its own
// beyond keyset pagination. Senior/admin only; the server enforces it and
// this page explains the 403 instead of showing an empty table.

const card: React.CSSProperties = { background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6 };

// "PATCH ^/v1/console/alerts/([\w-]+)$" -> "Alert updated" — the raw route
// stays in the title attribute for precision.
const actionLabel = (action: string): string => {
  if (action === 'login') return 'Signed in';
  if (action === 'login.failed') return 'Failed sign-in';
  if (action === 'logout') return 'Signed out';
  const m = action.match(/^(POST|PATCH|DELETE) \^?\/v1\/console\/([a-z-]+)(.*)$/);
  if (!m) return action;
  const verb = { POST: 'created', PATCH: 'updated', DELETE: 'deleted' }[m[1] as 'POST'] ?? m[1];
  const noun: Record<string, string> = {
    alerts: 'Alert', cases: 'Case', settings: 'Settings', 'api-keys': 'API key',
    team: 'Team member',
  };
  const rest = m[3] || '';
  if (rest.includes('assign')) return 'Alert assigned';
  if (rest.includes('snooze')) return 'Alert snoozed';
  if (rest.includes('actions')) return 'Containment action';
  if (rest.includes('case')) return 'Case opened';
  if (rest.includes('invitations') && m[1] === 'POST') return rest.includes('resend') ? 'Invitation resent' : 'Invitation sent';
  if (rest.includes('invitations') && m[1] === 'DELETE') return 'Invitation revoked';
  return `${noun[m[2]] ?? m[2]} ${verb}`;
};

const detailSummary = (e: AuditEntry): string => {
  const d = e.detail ?? {};
  const parts: string[] = [];
  for (const k of ['state', 'disposition', 'kind', 'note', 'reason', 'email', 'role', 'minutes', 'assignee', 'name']) {
    const v = d[k];
    if (v !== undefined && v !== '' && v !== null) parts.push(`${k}: ${String(v)}`);
    if (parts.length >= 3) break;
  }
  return parts.join(' · ');
};

export function AuditLog() {
  useConsoleTitle('Audit Log');
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [nextBefore, setNextBefore] = useState(0);
  const [actor, setActor] = useState('');
  const [applied, setApplied] = useState('');
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  async function load(before?: number, actorFilter = applied) {
    setLoading(true);
    try {
      const page = await consoleApi.auditLog({ before, actor: actorFilter || undefined });
      setEntries((prev) => (before ? [...prev, ...page.entries] : page.entries));
      setNextBefore(page.nextBefore);
      setForbidden(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) setForbidden(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(undefined, applied);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied]);

  if (forbidden) {
    return (
      <div style={{ padding: 28 }}>
        <EmptyState
          title="Supervisory access required"
          description="The audit trail records every analyst and admin action. Reading it requires the senior or admin role — ask a tenant admin if your investigation needs it."
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'Barlow', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D71A28' }}>
            Administration
          </div>
          <p style={{ fontSize: '13.5px', color: '#5A6976', marginTop: 6, maxWidth: 640, lineHeight: 1.6 }}>
            Every sign-in and every change made through the console — dispositions, containment
            actions, team and settings changes — with who made it and when. Append-only.
          </p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setApplied(actor.trim()); }}
          style={{ display: 'flex', gap: 8 }}
        >
          <input
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            placeholder="Filter by actor…"
            aria-label="Filter by actor"
            style={{
              padding: '9px 12px', border: '1px solid #E0E5EA', borderRadius: 3, fontSize: 13,
              fontFamily: "'Open Sans', sans-serif", width: 220,
            }}
          />
          <button
            type="submit"
            className="press-scale"
            style={{
              padding: '9px 16px', borderRadius: 3, border: '1px solid #E0E5EA', background: '#fff',
              color: '#5A6976', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'color .15s, transform .15s',
            }}
          >
            Filter
          </button>
        </form>
      </div>

      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1.2fr 100px 1fr 1fr 1.4fr', gap: 12, padding: '12px 22px', borderBottom: '1px solid #E9EDF1', fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A8593' }}>
          <div>When</div><div>Actor</div><div>Role</div><div>Action</div><div>Target</div><div>Detail</div>
        </div>
        {loading && entries.length === 0 ? (
          <div style={{ padding: 22 }}><SkeletonLines n={8} gap={14} /></div>
        ) : entries.length === 0 ? (
          <div style={{ padding: 22 }}>
            <EmptyState title="No audit entries" description={applied ? 'Nothing matches this actor filter.' : 'Actions taken in the console will appear here.'} />
          </div>
        ) : (
          entries.map((e) => (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '150px 1.2fr 100px 1fr 1fr 1.4fr', gap: 12, alignItems: 'start', padding: '12px 22px', borderBottom: '1px solid #F0F2F5' }}>
              <div style={{ fontSize: 12, color: '#5A6976', fontVariantNumeric: 'tabular-nums' }} title={e.at}>
                {new Date(e.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div style={{ minWidth: 0, fontSize: '12.5px', fontWeight: 700, color: '#1E262E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={e.actor}>
                {e.actor_name || e.actor}
              </div>
              <div>
                {e.actor_role ? <Chip color={roleColors[e.actor_role] ?? '#5A6976'}>{e.actor_role}</Chip> : <span style={{ color: '#C9CED4', fontSize: 12 }}>—</span>}
              </div>
              <div title={e.action}>
                <span style={{ fontSize: 13, fontWeight: e.action === 'login.failed' ? 700 : 400, color: e.action === 'login.failed' ? '#D71A28' : '#3E4753' }}>
                  {actionLabel(e.action)}
                </span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#5A6976' }}>{e.target || '—'}</div>
              <div style={{ fontSize: 12, color: '#7A8593', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={detailSummary(e)}>
                {detailSummary(e) || '—'}
              </div>
            </div>
          ))
        )}
        {nextBefore > 0 && (
          <div style={{ padding: '14px 22px' }}>
            <button
              type="button"
              className="press-scale"
              disabled={loading}
              onClick={() => void load(nextBefore)}
              style={{
                padding: '9px 16px', borderRadius: 3, border: '1px solid #E0E5EA', background: '#fff',
                color: '#5A6976', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700,
                letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'color .15s, transform .15s',
              }}
            >
              {loading ? 'Loading…' : 'Load older'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
