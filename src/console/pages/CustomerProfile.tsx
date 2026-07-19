import { useNavigate, useParams } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { Chip } from '../components/Chip';
import { ScoreBadge } from '../components/ScoreBadge';
import { consoleApi, shortRef } from '../api';
import type { UserProfile } from '../api';
import { useApi } from '../useApi';

export function CustomerProfile() {
  const { name: userRef = '' } = useParams();
  const navigate = useNavigate();
  useConsoleTitle('Customer profile');

  const { data: p, loading, error } = useApi<UserProfile>(() => consoleApi.user(userRef), [userRef]);

  if (loading) return <div style={{ padding: 28, fontSize: 13, color: '#7A8593' }}>Loading profile…</div>;
  if (error || !p) {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ fontFamily: 'Barlow', fontSize: 16, fontWeight: 700 }}>Subject not found</div>
        <div style={{ fontSize: 13, color: '#7A8593', marginTop: 6 }}>{error?.message || 'No profile for this reference.'}</div>
        <button type="button" onClick={() => navigate('/console/alerts')}
          style={{ marginTop: 14, padding: '10px 16px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3, fontFamily: 'Barlow', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Back to queue
        </button>
      </div>
    );
  }

  const openAlerts = p.alerts.filter((a) => a.state !== 'Resolved').length;
  const initials = shortRef(p.user_ref, 2).slice(0, 2).toUpperCase();

  return (
    <div style={{ padding: '24px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          background: 'transparent', border: 'none', color: '#5A6976', fontFamily: 'Barlow', fontSize: 12,
          fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
        }}
      >
        ← Back
      </button>

      <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1D1D1B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#1D1D1B' }} title={p.user_ref}>{shortRef(p.user_ref, 20)}</div>
            <Chip color={openAlerts > 0 ? '#D71A28' : '#2FBF71'}>{openAlerts > 0 ? `${openAlerts} open` : 'No open alerts'}</Chip>
          </div>
          <div style={{ fontSize: 13, color: '#5A6976', marginTop: 6 }}>
            Pseudonymous subject · {p.session_count} sessions · first seen {new Date(p.first_seen).toLocaleDateString()} · last seen {new Date(p.last_seen).toLocaleDateString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 24, fontWeight: 800, color: '#1D1D1B' }}>{p.alerts.length}</div>
            <div style={{ fontSize: 11, color: '#7A8593' }}>alerts on record</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #E9EDF1', fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>
              Alert history
            </div>
            {p.alerts.length ? (
              p.alerts.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', borderBottom: '1px solid #F0F2F5' }}>
                  <ScoreBadge score={a.score} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'Barlow', fontWeight: 700, fontSize: 13, color: '#1E262E' }}>{a.id}</span>
                      <Chip color={a.state === 'Resolved' ? '#2FBF71' : '#E67E22'}>{a.state}</Chip>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#5A6976', marginTop: 5 }}>{a.signal}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/console/alerts/${a.id}`)}
                    style={{ padding: '8px 14px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3, fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    Review
                  </button>
                </div>
              ))
            ) : (
              <div style={{ padding: '18px 22px', fontSize: '12.5px', color: '#7A8593' }}>No alerts on record for this subject.</div>
            )}
          </div>

          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #E9EDF1', fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>
              Recent sessions
            </div>
            {p.recentSessions.length ? (
              p.recentSessions.map((s) => (
                <div key={s.session_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderBottom: '1px solid #F0F2F5', fontSize: '12.5px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#3E4753' }}>{shortRef(s.session_id, 8)}</span>
                  <span style={{ flex: 1, color: '#7A8593' }}>{new Date(s.started_at).toLocaleString()} · {s.event_count} events</span>
                  {s.sim_changed && <Chip color="#E67E22">SIM change</Chip>}
                </div>
              ))
            ) : (
              <div style={{ padding: '18px 22px', fontSize: '12.5px', color: '#7A8593' }}>No sessions recorded.</div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Known devices</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              {p.devices.length === 0 && <div style={{ fontSize: '12.5px', color: '#7A8593' }}>No devices on record.</div>}
              {p.devices.map((dv) => {
                const fp = dv.fingerprint;
                const label = fp ? `${fp.manufacturer ?? ''} ${fp.model ?? ''}`.trim() || shortRef(dv.install_id, 12) : shortRef(dv.install_id, 12);
                return (
                  <div key={dv.install_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: '#2FBF71' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
                      <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2 }}>
                        {dv.session_count} sessions · known since {new Date(dv.first_seen).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
