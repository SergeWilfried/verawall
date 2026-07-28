import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useConsoleTitle } from '../TitleContext';
import { weekData, moduleDefs } from '../../data/console/overview';
import { consoleApi } from '../api';
import type { ActivityItem } from '../api';
import { useApi } from '../useApi';
import { Skeleton } from '../components/Skeleton';
import { EmptyInline } from '../components/EmptyState';
import { PulseArt } from '../components/emptyArt';

const DemoTag = () => {
  const { t } = useTranslation();
  return (
    <span style={{ fontFamily: 'Barlow', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: '#9DA2A7', background: '#F0F2F5', borderRadius: 3, padding: '2px 6px' }}>
      {t('overview.demoData')}
    </span>
  );
};

const activityColor: Record<string, string> = { alert: '#D71A28', action: '#E67E22', case: '#2C7BB6' };

function presentActivity(a: ActivityItem, t: TFunction): { what: string; detail: string } {
  if (a.kind === 'alert') return { what: t('overview.activityAlertRaised', { id: a.id }), detail: a.threat_type ? `— ${a.threat_type}: ${a.detail}` : `— ${a.detail}` };
  if (a.kind === 'case') return { what: t('overview.activityCaseOpened', { id: a.id }), detail: a.detail ? `— ${a.detail}` : '' };
  const kind = a.detail.replace(/_/g, ' ').toLowerCase();
  return { what: t('overview.activityAction', { id: a.id }), detail: `— ${kind}` };
}

const relTime = (iso: string, t: TFunction) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return t('overview.relJustNow');
  if (m < 60) return t('overview.relMinAgo', { m });
  const h = Math.round(m / 60);
  return h < 24 ? t('overview.relHAgo', { h }) : t('overview.relDAgo', { d: Math.round(h / 24) });
};

export function Overview() {
  const { t } = useTranslation();
  useConsoleTitle(t('nav.items.overview'));
  const navigate = useNavigate();
  const maxWeek = Math.max(...weekData.map((w) => w.v));

  const { data: stats } = useApi(() => consoleApi.overview(), []);
  const { data: activity } = useApi(() => consoleApi.activity(6), []);
  const { data: detections } = useApi(() => consoleApi.detections(365), []);
  const topThreats = (detections ?? []).filter((d) => d.threat_type !== 'Unclassified').slice(0, 3);

  const dash = (v: number | undefined) => (v === undefined ? '—' : String(v));
  const kpis = [
    { label: t('overview.kpiOpenAlerts'), value: dash(stats?.openAlerts), sub: t('overview.kpiOpenAlertsSub') },
    { label: t('overview.kpiSessions24h'), value: dash(stats?.sessionsLast24h), sub: t('overview.kpiSessions24hSub') },
    { label: t('overview.kpiHeld30d'), value: dash(stats?.decisionsLast30d?.held), sub: t('overview.kpiHeld30dSub') },
    { label: t('overview.kpiKnownUsers'), value: dash(stats?.knownUsers), sub: t('overview.kpiKnownUsersSub') },
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
              {k.value === '—' && !stats
                ? <Skeleton w={64} h={30} style={{ margin: '4px 0' }} />
                : <div style={{ fontFamily: 'Barlow', fontSize: 30, fontWeight: 800, color: '#1D1D1B', fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>}
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
                <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>{t('overview.chartTitle')}</div>
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
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>{t('overview.latestActivity')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 14 }}>
              {!activity && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0', borderBottom: '1px solid #F0F2F5' }}>
                      <Skeleton w={8} h={8} r={4} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Skeleton w={`${60 + ((i * 13) % 30)}%`} h={12} />
                        <Skeleton w={90} h={10} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activity && activity.length === 0 && (
                <EmptyInline message={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#C9CED4', display: 'flex' }}><PulseArt size={22} /></span>
                    {t('overview.noActivity')}
                  </span>
                } />
              )}
              {(activity ?? []).map((ac, i) => {
                const p = presentActivity(ac, t);
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
                    <div style={{ fontSize: '11.5px', color: '#7A8593', whiteSpace: 'nowrap' }}>{relTime(ac.at, t)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* MODULE HEALTH */}
          <div style={{ background: '#1D1D1B', color: '#EAEAEA', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700, color: '#fff' }}>{t('overview.platformModules')}</div>
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
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>{t('overview.topThreats')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              {topThreats.length === 0 && <EmptyInline message={t('overview.noDetections')} />}
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
                    <div style={{ fontSize: '11.5px', color: '#7A8593' }}>{t('overview.openTotal', { open: d.open, count: d.count })}</div>
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
              {t('overview.allDetections')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
