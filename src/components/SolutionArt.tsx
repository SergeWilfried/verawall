// Solution-page illustrations — VeraWall's own, built in React/SVG (no images
// to license). Same "floating UI cards with severity chips" idiom as the
// product, in the brand red, with 0–100 scores and real signal names from the
// scoring engine. One composition per fraud family; picked by slug.

import type { CSSProperties, ReactNode } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';

const RED = '#D71A28';
const INK = '#1E262E';
const MUTED = '#5A6976';
const FAINT = '#8A94A0';
const LINE = '#E3E7EB';
const AMBER = '#C67C00';

type Sev = 'HIGH' | 'MED';

function Chip({ sev, children }: { sev: Sev; children: ReactNode }) {
  const { t } = useLanguage();
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 7, padding: '7px 12px 7px 7px', boxShadow: '0 8px 20px rgba(20,30,40,0.08)' }}>
      <span
        style={{
          fontFamily: 'Barlow',
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.06em',
          color: '#fff',
          background: sev === 'HIGH' ? RED : AMBER,
          borderRadius: 4,
          padding: '3px 6px',
        }}
      >
        {sev === 'HIGH' ? t('HIGH') : t('MEDIUM')}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{children}</span>
    </div>
  );
}

function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, boxShadow: '0 20px 50px rgba(20,30,40,0.10)', padding: 20, display: 'flex', flexDirection: 'column', ...style }}>
      {children}
    </div>
  );
}

function Meter({ label, value, max = 1000 }: { label: string; value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 14, color: FAINT }}>{label}</span>
        <span style={{ fontFamily: 'Barlow', fontSize: 20, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums' }}>
          {value}
          <span style={{ fontSize: 12, color: FAINT }}>/{max}</span>
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: '#EEF1F4', marginTop: 8, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: RED, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function Row({ k, v, danger }: { k: string; v: string; danger?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '5px 0' }}>
      <span style={{ color: MUTED }}>{k}</span>
      <span style={{ color: danger ? RED : INK, fontWeight: 700 }}>{v}</span>
    </div>
  );
}

// Rising-risk sparkline on a faint plus-grid — the recurring "behavior
// biometrics" motif, drawn to our palette.
function Spark({ w = 300, h = 150 }: { w?: number; h?: number }) {
  const pts = [
    [8, 118],
    [70, 96],
    [132, 104],
    [196, 86],
    [w - 8, 20],
  ];
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  const cols = 4;
  const rows = 3;
  const grid: ReactNode[] = [];
  for (let c = 0; c <= cols; c++)
    for (let r = 0; r <= rows; r++) {
      const x = 8 + (c * (w - 16)) / cols;
      const y = 20 + (r * (h - 40)) / rows;
      grid.push(<path key={`${c}-${r}`} d={`M${x - 4} ${y}h8M${x} ${y - 4}v8`} stroke="#D5DBE1" strokeWidth={1} />);
    }
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }} aria-hidden="true">
      {grid}
      <path d={d} fill="none" stroke={RED} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 6 : 4} fill={RED} />
      ))}
    </svg>
  );
}

// Score gauge 0–100 with the three policy bands (transaction-risk story).
function Gauge({ score = 72 }: { score?: number }) {
  const cx = 150;
  const cy = 150;
  const r = 118;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  // Top semicircle: 0 → west (left), 50 → north (up), 100 → east (right).
  const ang = (pct: number) => 180 + (pct / 100) * 180;
  const pt = (pct: number, rr: number) => [cx + rr * Math.cos(rad(ang(pct))), cy + rr * Math.sin(rad(ang(pct)))];
  const arc = (from: number, to: number, color: string) => {
    const [x1, y1] = pt(from, r);
    const [x2, y2] = pt(to, r);
    return <path d={`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={15} strokeLinecap="round" />;
  };
  const [nx, ny] = pt(score, r * 0.8);
  return (
    <svg width="100%" viewBox="0 0 300 176" aria-hidden="true">
      {arc(1, 52, '#1E9E5A')}
      {arc(56, 82, AMBER)}
      {arc(86, 99, RED)}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={9} fill={INK} />
      <text x={cx} y={cy - 30} textAnchor="middle" fontFamily="Barlow" fontWeight="800" fontSize="46" fill={RED}>
        {score}
      </text>
    </svg>
  );
}

// Follow-the-money mini graph: one inbound → central account → fan-out.
function MoneyGraph({ w = 320, h = 240 }: { w?: number; h?: number }) {
  const cx = w * 0.4;
  const cy = h / 2;
  const outs = [
    [w - 24, 30],
    [w - 16, 90],
    [w - 20, 150],
    [w - 34, 210],
  ];
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <line x1={20} y1={cy} x2={cx} y2={cy} stroke="#1E9E5A" strokeWidth={2.5} />
      {outs.map((o, i) => (
        <line key={i} x1={cx} y1={cy} x2={o[0]} y2={o[1]} stroke={RED} strokeWidth={2.5} />
      ))}
      <circle cx={20} cy={cy} r={9} fill="#1E9E5A" />
      {outs.map((o, i) => (
        <circle key={i} cx={o[0]} cy={o[1]} r={8} fill={RED} />
      ))}
      <circle cx={cx} cy={cy} r={16} fill={INK} />
      <circle cx={cx} cy={cy} r={22} fill="none" stroke={RED} strokeWidth={2} opacity={0.4} />
    </svg>
  );
}

// Keystroke cadence strip: bars = inter-key gaps; a red bar marks a paste.
function Cadence() {
  const gaps = [16, 22, 12, 18, 26, 14, 20, 60, 15, 19, 23, 13];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 60 }}>
      {gaps.map((g, i) => (
        <div key={i} style={{ width: 8, height: g * 1.6, borderRadius: 2, background: g >= 50 ? RED : '#C7CED6' }} title={g >= 50 ? 'paste' : 'keystroke'} />
      ))}
    </div>
  );
}

// ---------- per-family compositions ----------

function Split({ left, right }: { left: ReactNode; right: ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, alignItems: 'stretch', maxWidth: 860, margin: '0 auto' }}>
      {left}
      {right}
    </div>
  );
}

function AtoArt() {
  const { t } = useLanguage();
  return (
    <Split
      left={
        <Panel>
          <div style={{ fontSize: 15, color: FAINT, marginBottom: 14 }}>{t('Device information')}</div>
          <Meter label={t('Device score')} value={749} />
          <div style={{ marginTop: 14, borderTop: `1px solid ${LINE}`, paddingTop: 8 }}>
            <Row k={t('Platform')} v="Windows · TOR" />
            <Row k={t('Known device')} v={t('First seen this session')} danger />
            <Row k={t('SIM')} v={t('Changed 2 h ago')} danger />
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <Chip sev="HIGH">{t('Untrusted device')}</Chip>
          </div>
        </Panel>
      }
      right={
        <Panel style={{ padding: 18 }}>
          <div style={{ fontSize: 14, color: FAINT, marginBottom: 6 }}>{t('Behavior biometrics')}</div>
          <Spark />
          <div style={{ marginTop: 'auto', paddingTop: 12 }}>
            <Chip sev="HIGH">{t('Behavior biometrics risk')}</Chip>
          </div>
        </Panel>
      }
    />
  );
}

function ScamArt() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'auto auto', gap: 40, alignItems: 'center', width: 'fit-content', maxWidth: 760, margin: '0 auto', justifyContent: 'center' }}>
      <div style={{ width: 210, background: '#0F1418', borderRadius: 26, padding: 10, margin: isMobile ? '0 auto' : 0, boxShadow: '0 24px 50px rgba(20,30,40,0.22)' }}>
        <div style={{ background: '#12463F', borderRadius: 18, overflow: 'hidden', textAlign: 'center', color: '#fff', fontFamily: 'Barlow' }}>
          <div style={{ padding: '22px 0 8px', fontSize: 20, fontWeight: 700 }}>Bank24</div>
          <div style={{ fontSize: 12, opacity: 0.7, paddingBottom: 18 }}>{t('calling')}</div>
          <div style={{ background: '#1E2A2C', padding: '26px 0' }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: '#33413F', margin: '0 auto' }} />
            <div style={{ width: 52, height: 52, borderRadius: 26, background: RED, margin: '22px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true" style={{ transform: 'rotate(135deg)' }}>
                <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.58 3.6a1 1 0 0 1-.25 1z"/>
              </svg>
            </div>
          </div>
          <div style={{ height: 26, background: '#12463F' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: isMobile ? 'center' : 'flex-start' }}>
        <Chip sev="HIGH">{t('Active phone call')}</Chip>
        <Chip sev="HIGH">{t('New payee paid immediately')}</Chip>
        <Chip sev="MED">{t('Screen sharing detected')}</Chip>
        <Chip sev="MED">{t('Signs of coercion')}</Chip>
      </div>
    </div>
  );
}

function MuleArt() {
  const { t } = useLanguage();
  return (
    <Split
      left={
        <Panel style={{ padding: 18 }}>
          <div style={{ fontSize: 14, color: FAINT, marginBottom: 6 }}>{t('Follow the money')}</div>
          <MoneyGraph />
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <Chip sev="HIGH">{t('Rapid in-out · 11 min')}</Chip>
          </div>
        </Panel>
      }
      right={
        <Panel>
          <div style={{ fontSize: 15, color: FAINT, marginBottom: 14 }}>{t('Payment')}</div>
          <Meter label={t('Payment score')} value={809} />
          <div style={{ marginTop: 14, borderTop: `1px solid ${LINE}`, paddingTop: 8 }}>
            <Row k={t('Amount')} v={t('Abnormal')} danger />
            <Row k={t('Beneficiary trust')} v={t('Low')} danger />
            <Row k={t('Prior inactivity')} v="+6 M" />
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <Chip sev="MED">{t('Unusual account activity')}</Chip>
          </div>
        </Panel>
      }
    />
  );
}

function SimArt() {
  const { t } = useLanguage();
  return (
    <Split
      left={
        <Panel>
          <div style={{ fontSize: 15, color: FAINT, marginBottom: 14 }}>{t('SIM & device telemetry')}</div>
          <Row k={t('SIM')} v={t('Changed 2 h ago')} danger />
          <Row k={t('Install age')} v={t('First seen this session')} danger />
          <Row k={t('Location')} v={t('Impossible travel')} danger />
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <Chip sev="HIGH">{t('SIM swap suspected')}</Chip>
          </div>
        </Panel>
      }
      right={
        <Panel style={{ padding: 18 }}>
          <div style={{ fontSize: 14, color: FAINT, marginBottom: 12 }}>{t('Keystroke cadence')}</div>
          <Cadence />
          <div style={{ marginTop: 'auto', paddingTop: 14 }}>
            <Chip sev="MED">{t('Credential pasted, not typed')}</Chip>
          </div>
        </Panel>
      }
    />
  );
}

function NafArt() {
  const { t } = useLanguage();
  return (
    <Split
      left={
        <Panel>
          <div style={{ fontSize: 15, color: FAINT, marginBottom: 14 }}>{t('New application')}</div>
          <Row k={t('Install age')} v="0 min" danger />
          <Row k={t('Device')} v={t('Emulator')} danger />
          <Row k={t('Identity entry')} v={t('Pasted')} danger />
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <Chip sev="HIGH">{t('Synthetic identity risk')}</Chip>
          </div>
        </Panel>
      }
      right={
        <Panel style={{ padding: 18 }}>
          <div style={{ fontSize: 14, color: FAINT, marginBottom: 6 }}>{t('Behavior biometrics')}</div>
          <Spark />
          <div style={{ marginTop: 'auto', paddingTop: 12 }}>
            <Chip sev="MED">{t('Bot / automated signup')}</Chip>
          </div>
        </Panel>
      }
    />
  );
}

function TraArt() {
  const { t } = useLanguage();
  return (
    <Split
      left={
        <Panel style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 15, color: FAINT, marginBottom: 6 }}>{t('Transaction risk score')}</div>
          <Gauge score={72} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, marginTop: 4 }}>
            <span style={{ color: '#1E9E5A' }}>ALLOW</span>
            <span style={{ color: AMBER }}>STEP_UP</span>
            <span style={{ color: RED }}>HOLD</span>
          </div>
        </Panel>
      }
      right={
        <Panel>
          <div style={{ fontSize: 15, color: FAINT, marginBottom: 14 }}>{t('Policy bands')}</div>
          <Row k="0–54" v="ALLOW" />
          <Row k="55–84" v="STEP_UP" />
          <Row k="85–100" v="HOLD" danger />
          <div style={{ marginTop: 14, borderTop: `1px solid ${LINE}`, paddingTop: 8 }}>
            <Row k={t('Thresholds')} v={t('Per tenant & currency')} />
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <Chip sev="MED">{t('Invisible authentication')}</Chip>
          </div>
        </Panel>
      }
    />
  );
}

const SCAM_SLUGS = new Set(['app-scams', 'investment-scams', 'p2p-fraud', 'romance-scams', 'purchase-scams']);

export type ArtKind = 'ato' | 'scam' | 'mule' | 'sim' | 'naf' | 'tra';

export function artKindForSlug(slug: string): ArtKind {
  if (slug === 'account-takeover') return 'ato';
  if (slug === 'money-mules') return 'mule';
  if (slug === 'agent-fraud') return 'mule';
  if (slug === 'credential-theft') return 'sim';
  if (slug === 'new-account-fraud') return 'naf';
  if (slug === 'transaction-risk') return 'tra';
  if (SCAM_SLUGS.has(slug)) return 'scam';
  return 'scam';
}

const ART: Record<ArtKind, () => ReactNode> = {
  ato: AtoArt,
  scam: ScamArt,
  mule: MuleArt,
  sim: SimArt,
  naf: NafArt,
  tra: TraArt,
};

/** Illustration band — placed under the solution hero, above the cards. */
export function SolutionArt({ kind, title }: { kind: ArtKind; title: string }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const Art = ART[kind];
  return (
    <section style={{ background: '#FBFBFC', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: isMobile ? '48px 15px' : '72px 15px' }}>
        <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700, textAlign: 'center', marginBottom: isMobile ? 32 : 48, textWrap: 'balance' }}>{t(title)}</h2>
        <Art />
      </div>
    </section>
  );
}
