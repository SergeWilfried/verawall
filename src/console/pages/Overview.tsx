import { useNavigate } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { weekData, moduleDefs } from '../../data/console/overview';
import { consoleApi } from '../api';
import type { ActivityItem } from '../api';
import { useApi } from '../useApi';

const DemoTag = () => (
  <span style={{ fontFamily: 'Barlow', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: '#9DA2A7', background: '#F0F2F5', borderRadius: 3, padding: '2px 6px' }}>
    demo data
  </span>
);

const activityColor: Record<string, string> = { alert: '#D71A28', action: '#E67E22', case: '#2C7BB6' };

function presentActivity(a: ActivityItem): { what: string; detail: string } {
  if (a.kind === 'alert') return { what: `Alert ${a.id} raised`, detail: a.threat_type ? `— ${a.threat_type}: ${a.detail}` : `— ${a.detail}` };
  if (a.kind === 'case') return { what: `Case ${a.id} opened`, detail: a.detail ? `— ${a.detail}` : '' };
  const kind = a.detail.replace(/_/g, ' ').toLowerCase();
  return { what: `Action ${a.id}`, detail: `— ${kind}` };
}

const relTime = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};

export function Overview() {
  useConsoleTitle('Overview');
  const navigate = useNavigate();
  const maxWeek = Math.max(...weekData.map((w) => w.v));

  const { data: stats } = useApi(() => consoleApi.overview(), []);
  const { data: activity } = useApi(() => consoleApi.activity(6), []);
  const { data: detections } = useApi(() => consoleApi.detections(365), []);
  const topThreats = (detections ?? []).filter((d) => d.threat_type !== 'Unclassified').slice(0, 3);

  const dash = (v: number | undefined) => (v === undefined ? '—' : String(v));
  const kpis = [
    { label: 'Open alerts', value: dash(stats?.openAlerts), sub: 'awaiting analyst review' },
    { label: 'Sessions — 24h', value: dash(stats?.sessionsLast24h), sub: 'ingested behavioral sessions' },
    { label: 'Held — 30 days', value: dash(stats?.decisionsLast30d?.held), sub: 'payments routed to review' },
    { label: 'Known users', value: dash(stats?.knownUsers), sub: 'pseudonymous profiles' },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI ROW — live from GET /v1/console/overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: '20px 22px' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A8593' }}>
              {k.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 30, fontWeight: 800, color: '#1D1D1B' }}>{k.value}</div>
            </div>
            <div style={{ fontSize: 12, color: '#7A8593', marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* FRAUD PREVENTED CHART */}
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Fraud losses prevented — 8 weeks</div>
                <DemoTag />
              </div>
              <div style={{ fontFamily: 'Barlow', fontSize: 13, fontWeight: 700, color: '#D71A28' }}>Σ 9.6M Kč</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 14, alignItems: 'end', height: 180, marginTop: 22 }}>
              {weekData.map((w, i) => (
                <div key={w.label} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', gap: 6 }}>
                  <div style={{ textAlign: 'center', fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, color: '#5A6976' }}>
                    {w.v.toFixed(1)}M
                  </div>
                  <div
                    style={{
                      height: `${Math.round((w.v / maxWeek) * 100)}%`,
                      minHeight: 8,
                      background: i === weekData.length - 1 ? '#D71A28' : '#F0B9BD',
                      borderRadius: '3px 3px 0 0',
                      transition: 'height .4s',
                    }}
                  />
                  <div style={{ textAlign: 'center', fontSize: '10.5px', color: '#7A8593' }}>{w.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVITY FEED — live from GET /v1/console/activity */}
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Latest activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 14 }}>
              {(activity ?? []).length === 0 && (
                <div style={{ fontSize: '12.5px', color: '#7A8593', padding: '8px 0' }}>No recent activity.</div>
              )}
              {(activity ?? []).map((ac, i) => {
                const p = presentActivity(ac);
                const to = ac.kind === 'alert' ? `/console/alerts/${ac.id}` : ac.kind === 'case' ? '/console/cases' : null;
                return (
                  <div
                    key={ac.kind + ac.id + i}
                    onClick={to ? () => navigate(to) : undefined}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0', borderBottom: '1px solid #F0F2F5', cursor: to ? 'pointer' : 'default' }}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: activityColor[ac.kind], flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 13, overflow: 'hidden' }}>
                      <span style={{ fontWeight: 700 }}>{p.what}</span>{' '}
                      <span style={{ color: '#5A6976' }}>{p.detail}</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#7A8593', whiteSpace: 'nowrap' }}>{relTime(ac.at)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* MODULE HEALTH */}
          <div style={{ background: '#1D1D1B', color: '#EAEAEA', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700, color: '#fff' }}>Platform modules</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              {moduleDefs.map((m) => (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.ok ? '#2FBF71' : '#D71A28', flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#EAEAEA' }}>{m.name}</div>
                  <div style={{ fontSize: '11.5px', color: '#8A8F94' }}>{m.stat}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP THREATS — live from GET /v1/console/detections */}
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Top threats</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              {topThreats.length === 0 && <div style={{ fontSize: '12.5px', color: '#7A8593' }}>No detections yet.</div>}
              {topThreats.map((d) => (
                <button
                  key={d.threat_type}
                  type="button"
                  onClick={() => navigate(`/console/alerts?type=${encodeURIComponent(d.threat_type)}`)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%',
                    padding: '10px 12px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{d.threat_type}</div>
                    <div style={{ fontSize: '11.5px', color: '#7A8593' }}>{d.open} open · {d.count} total</div>
                  </div>
                  <div style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 18, color: '#D71A28' }}>{d.count}</div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate('/console/detections')}
              style={{
                marginTop: 16, width: '100%', padding: 12, background: '#fff', color: '#D71A28',
                border: '1px solid #D71A28', borderRadius: 3, fontFamily: 'Barlow', fontSize: 12, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              All detections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
