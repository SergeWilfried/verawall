import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { consoleApi } from '../api';
import { useApi } from '../useApi';
import { Skeleton, SkeletonLines } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { RadarArt } from '../components/emptyArt';
import { typeColors } from '../../data/console/alerts';
import type { ThreatType } from '../../data/console/types';

const threatColor = (t: string) => typeColors[t as ThreatType] || '#7A8593';

// Short human labels for the behavioral signals the engine fires.
const signalHint: Record<string, string> = {
  ACTIVE_CALL: 'Coached-scam tell', NEW_DEVICE_FOR_USER: 'Account takeover',
  RECENT_CALL: 'Coached-scam tell', CALL_HANDS_FREE: 'Coached-scam tell',
  RUSHED_NEW_PAYEE: 'Coached-scam tell',
  AMOUNT_ABOVE_PROFILE: 'Out of pattern', MOCK_LOCATION: 'Fake GPS',
  IMPOSSIBLE_TRAVEL: 'Geo-velocity', REMOTE_ACCESS: 'On-device fraud',
  HEADLESS_BROWSER: 'Bot / automation', MOUSE_ANOMALY: 'Web behavior',
  TOUCH_ANOMALY: 'Touch behavior', KEYSTROKE_ANOMALY: 'Typing cadence',
  SIDELOADED_APP: 'Tampered install', DEBUG_BUILD: 'Tampered install',
  DEV_OPTIONS: 'Device posture', SCREENSHOT: 'Screen exfiltration',
  STEP_UP_FAILED: 'Failed challenge', STEP_UP_ABANDONED: 'Abandoned challenge',
  RAPID_IN_OUT: 'Mule flow', FAN_OUT_24H: 'Mule dispersion',
  DORMANT_REACTIVATED: 'Dormant account', SIM_CHANGED: 'SIM change',
};

const threatDesc: Record<string, string> = {
  'APP Scam': 'Authorized push-payment and coached-session scams caught in real time.',
  'Account Takeover': 'Remote access, session hijacking and SIM swap — flagged by behavioral mismatch.',
  'Money Mule': 'Rapid in-out transfers from the bank-feed ledger.',
  'New Account Fraud': 'Stolen or synthetic identities at onboarding.',
  'Agent Commission Fraud': 'Deposits split into sub-threshold bursts to farm commissions.',
  Unclassified: 'Held without a single dominant classification.',
};

const card: React.CSSProperties = { background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6 };

function Bars({ n }: { n: number }) {
  return <SkeletonLines n={n} gap={14} />;
}

export function Detections() {
  useConsoleTitle('Detections');
  const navigate = useNavigate();
  const { data, loading, error } = useApi(() => consoleApi.detectionAnalytics(30), []);

  const bySignal = data?.bySignal ?? [];
  const byThreat = data?.byThreat ?? [];
  const trend = data?.trend ?? [];
  const outcomes = data?.outcomes ?? { hold: 0, step_up: 0, allow: 0, total: 0 };

  const maxSignal = Math.max(1, ...bySignal.map((s) => s.count));
  const maxThreat = Math.max(1, ...byThreat.map((t) => t.count));
  const alertsTotal = byThreat.reduce((a, t) => a + t.count, 0);
  const holdRate = outcomes.total ? Math.round((outcomes.hold / outcomes.total) * 100) : 0;

  // 30-day trend, gap-filled so quiet days read as gaps not skips.
  const trendBars = useMemo(() => {
    const byDay = new Map(trend.map((t) => [t.day, t.count]));
    const out: { day: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      out.push({ day: key, count: byDay.get(key) ?? 0 });
    }
    return out;
  }, [trend]);
  const maxTrend = Math.max(1, ...trendBars.map((b) => b.count));

  const kpis = [
    { label: 'Detections · 30d', value: alertsTotal.toLocaleString(), sub: 'alerts raised by the engine' },
    { label: 'Hold rate', value: `${holdRate}%`, sub: `${outcomes.hold.toLocaleString()} of ${outcomes.total.toLocaleString()} scored` },
    { label: 'Signals firing', value: String(bySignal.length), sub: 'distinct behavioral signals' },
    { label: 'Top threat', value: byThreat[0]?.threat_type ?? '—', sub: byThreat[0] ? `${byThreat[0].count} alerts` : 'none yet', small: true },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ maxWidth: 760 }}>
        <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D71A28' }}>Detections</div>
        <div style={{ fontSize: 14, color: '#5A6976', marginTop: 6, lineHeight: 1.6 }}>
          What the Behavioral Intelligence Platform is catching — the signals firing, the daily trend, and the threat mix. Last 30 days.
        </div>
      </div>

      {error && <div style={{ fontSize: 13, fontWeight: 600, color: '#D71A28' }}>{error.message}</div>}

      {!loading && !error && alertsTotal === 0 && bySignal.length === 0 && (
        <div style={card}>
          <EmptyState illustration={<RadarArt />} title="No detections recorded yet"
            description="As sessions and transactions stream in, the signals firing and the threat mix appear here." />
        </div>
      )}

      {(loading || alertsTotal > 0 || bySignal.length > 0) && (
        <>
          {/* KPI strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 16 }}>
            {kpis.map((k, i) => (
              <div key={i} style={{ ...card, padding: '18px 20px' }}>
                <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A8593' }}>{k.label}</div>
                {loading ? <Skeleton w="60%" h={28} style={{ marginTop: 8 }} /> : (
                  <div style={{ fontFamily: 'Barlow', fontSize: k.small ? 18 : 26, fontWeight: 800, color: '#1D1D1B', marginTop: 6, lineHeight: 1.1 }}>{k.value}</div>
                )}
                <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
            {/* Top firing signals — the detection engine's actual output */}
            <div style={{ ...card, padding: 22 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Signals firing</div>
              <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2, marginBottom: 16 }}>Which behavioral signals the engine raised most, with their score weight.</div>
              {loading ? <Bars n={8} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {bySignal.map((s) => (
                    <div key={s.code}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 }}>
                        <span style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 12, color: '#D71A28', minWidth: 30 }}>+{s.weight}</span>
                        <span style={{ fontWeight: 600, fontSize: '12.5px', color: '#3E4753' }}>{s.label || s.code}</span>
                        {signalHint[s.code] && <span style={{ fontSize: 11, color: '#9AA4AF' }}>· {signalHint[s.code]}</span>}
                        <span style={{ marginLeft: 'auto', fontFamily: 'Barlow', fontWeight: 700, fontSize: '12.5px', color: '#5A6976', fontVariantNumeric: 'tabular-nums' }}>{s.count.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 7, background: '#EEF1F4', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round((s.count / maxSignal) * 100)}%`, height: '100%', background: '#D71A28', opacity: 0.35 + 0.5 * (s.count / maxSignal), borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Daily trend */}
              <div style={{ ...card, padding: 22 }}>
                <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Detection trend</div>
                <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2, marginBottom: 16 }}>Alerts raised per day · 30 days</div>
                {loading ? <Skeleton h={90} r={4} /> : (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 90 }}>
                    {trendBars.map((b) => (
                      <div key={b.day} title={`${new Date(b.day).toLocaleDateString()} · ${b.count}`}
                        style={{ flex: 1, height: `${Math.max(3, (b.count / maxTrend) * 100)}%`, minHeight: 3,
                          background: b.count > 0 ? '#D71A28' : '#EEF1F4', opacity: b.count > 0 ? 0.35 + 0.6 * (b.count / maxTrend) : 1, borderRadius: '2px 2px 0 0' }} />
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#9AA4AF', marginTop: 6, fontFamily: 'Barlow', letterSpacing: '0.04em' }}>
                  <span>30d ago</span><span>today</span>
                </div>
              </div>

              {/* Decision outcomes */}
              <div style={{ ...card, padding: 22 }}>
                <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Decision outcomes</div>
                <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2, marginBottom: 14 }}>Across {outcomes.total.toLocaleString()} scored payments</div>
                {loading ? <Bars n={3} /> : [
                  { name: 'Approved (frictionless)', n: outcomes.allow, c: '#2FBF71' },
                  { name: 'Step-up challenge', n: outcomes.step_up, c: '#E67E22' },
                  { name: 'Held for review', n: outcomes.hold, c: '#D71A28' },
                ].map((o) => {
                  const p = outcomes.total ? Math.round((o.n / outcomes.total) * 100) : 0;
                  return (
                    <div key={o.name} style={{ marginBottom: 11, fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{o.name}</span><span style={{ color: '#7A8593' }}>{p}%</span>
                      </div>
                      <div style={{ height: 7, background: '#EEF1F4', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${p}%`, height: '100%', background: o.c, borderRadius: 4 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Threat breakdown — compact rows, not giant cards */}
          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #E9EDF1', fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>By threat type</div>
            {loading ? <div style={{ padding: 22 }}><Bars n={4} /></div> : byThreat.map((t) => (
              <div key={t.threat_type} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1.4fr) 120px 96px', alignItems: 'center', gap: 16, padding: '14px 22px', borderBottom: '1px solid #F0F2F5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: threatColor(t.threat_type), flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Barlow', fontWeight: 700, fontSize: '13.5px', color: '#1E262E' }}>{t.threat_type}</span>
                </div>
                <div style={{ fontSize: 12, color: '#7A8593', lineHeight: 1.5 }}>{threatDesc[t.threat_type] ?? 'Alerts of this classification.'}</div>
                <div>
                  <div style={{ height: 7, background: '#EEF1F4', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ width: `${Math.round((t.count / maxThreat) * 100)}%`, height: '100%', background: threatColor(t.threat_type), borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#7A8593' }}>{t.open} open · {t.count} total</div>
                </div>
                <button type="button" onClick={() => navigate(`/console/alerts?type=${encodeURIComponent(t.threat_type)}`)}
                  style={{ padding: '8px 14px', background: '#fff', color: '#5A6976', border: '1px solid #E0E5EA', borderRadius: 3, fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', justifySelf: 'end' }}>
                  View
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
