import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { typeColors, scoreColor } from '../../data/console/alerts';
import type { ThreatType } from '../../data/console/types';
import { Chip } from '../components/Chip';
import { useAuth } from '../auth';
import { consoleApi, shortRef, subjectLabel } from '../api';
import { Skeleton, SkeletonLines } from '../components/Skeleton';
import type { AlertDetail, ServerEvent, ServerSignal } from '../api';
import { useApi } from '../useApi';

const flagColors: Record<string, string> = { Anomaly: '#E67E22', Critical: '#D71A28' };
const stateColors: Record<string, string> = { Open: '#E67E22', Contained: '#2C7BB6', Resolved: '#2FBF71' };
const threatColor = (t: string | null) => (t && typeColors[t as ThreatType]) || '#7A8593';

interface TimelineStep {
  t: string;
  event: string;
  detail: string;
  flag?: 'Anomaly' | 'Critical';
}

const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/** Present a stored SDK event as an analyst-readable timeline step. */
function presentEvent(ev: ServerEvent): TimelineStep {
  const t = fmtTime(ev.ts);
  const cs = ev.call_signals;
  const inCall = cs?.inGsmCall || cs?.inVoipCall;
  const p = ev.payload || {};
  switch (ev.type) {
    case 'BIZ_LOGIN_RESULT':
      return { t, event: 'Login', detail: `Outcome: ${String(p.outcome ?? 'unknown')}.` };
    case 'BIZ_PAYEE_ADDED':
      return { t, event: 'New payee added', detail: 'A first-time payee was added to the account.',
        flag: inCall ? 'Critical' : 'Anomaly' };
    case 'BIZ_TXN_INITIATED':
      return {
        t, event: 'Transaction initiated',
        detail: `${String(p.amountBucket ?? '')} ${String(p.currency ?? '')} · ${String(p.channel ?? '')}` +
          (p.payeeIsNew ? ' · new payee' : '') + (inCall ? ' · during an active call' : ''),
        flag: inCall ? 'Critical' : 'Anomaly',
      };
    case 'PASSIVE_KEYSTROKES':
      return { t, event: 'Keystroke dynamics', detail: `Timing captured on field ${String(p.fieldId ?? '')}.` };
    case 'PASSIVE_TOUCH_STROKES':
      return { t, event: 'Touch behavior', detail: 'Aggregated touch strokes captured.' };
    case 'PASSIVE_APP_INTEGRITY': {
      const sideloaded = 'installerPackage' in p &&
        ['', 'com.android.packageinstaller', 'com.google.android.packageinstaller']
          .includes(String(p.installerPackage));
      const bad = p.rootLikely || p.hookingFramework || p.emulatorLikely || p.debuggable || sideloaded;
      return { t, event: 'Device integrity check',
        detail: bad ? `Integrity risk: ${p.hookingFramework ? `hooking (${String(p.hookingFramework)})` : p.rootLikely ? 'root indicators' : p.emulatorLikely ? 'emulator' : p.debuggable ? 'debuggable build' : 'sideloaded install'}.`
                    : 'No integrity issues detected.',
        flag: bad ? 'Critical' : undefined };
    }
    case 'PASSIVE_CALL_STATE': {
      const dur = Number(p.durationMs ?? 0);
      return p.active
        ? { t, event: 'Call started', detail: `${String(p.kind ?? '')} call in progress.`, flag: 'Anomaly' }
        : { t, event: 'Call ended',
            detail: `${String(p.kind ?? '')} call ended${dur >= 60000 ? ` after ${Math.round(dur / 60000)} min` : ''}.` };
    }
    case 'PASSIVE_SIM_TELEMETRY':
      return { t, event: 'SIM telemetry',
        detail: p.simChangedSinceLastSession ? 'SIM changed since the last session.' : 'SIM state read.',
        flag: p.simChangedSinceLastSession ? 'Anomaly' : undefined };
    case 'PASSIVE_LOCATION_COARSE':
      return { t, event: 'Location',
        detail: `Coarse geohash ${String(p.geohash ?? '')}.` +
          (p.mock ? ' Injected by a mock provider (fake GPS).' : ''),
        flag: p.mock ? 'Critical' : undefined };
    case 'PASSIVE_DEVICE_FINGERPRINT':
      return { t, event: 'Device fingerprint', detail: `${String(p.manufacturer ?? '')} ${String(p.model ?? '')}`.trim() || 'Device fingerprint captured.' };
    case 'PASSIVE_WEB_FINGERPRINT':
      return { t, event: 'Browser fingerprint',
        detail: p.headless ? `Headless / automated browser${Array.isArray(p.botFlags) && p.botFlags.length ? ` — ${p.botFlags.join(', ')}` : ''}.` : `${String(p.userAgent ?? 'Browser fingerprint captured.')}`.slice(0, 90),
        flag: p.headless ? 'Critical' : undefined };
    case 'PASSIVE_MOUSE_STROKES':
      return { t, event: 'Mouse behavior', detail: 'Mouse movement dynamics captured.' };
    case 'PASSIVE_REMOTE_ACCESS': {
      const suspect = p.screenShareLikely || p.accessibilitySuspect;
      const matches = Array.isArray(p.accessibilityMatches) ? p.accessibilityMatches.join(', ') : '';
      return { t, event: 'Remote access check',
        detail: p.screenShareLikely ? `Screen sharing active — ${Number(p.extraDisplays ?? 0)} extra display(s)${matches ? ` · ${matches}` : ''}.`
              : p.accessibilitySuspect ? `Remote-control accessibility service${matches ? `: ${matches}` : ''}.`
              : 'No remote-access indicators.',
        flag: suspect ? 'Critical' : undefined };
    }
    case 'PASSIVE_COMMAND_ACK':
      return { t, event: 'Kill-switch acknowledged', detail: 'Device confirmed the terminate command.', flag: 'Critical' };
    case 'SCREEN_VIEWED':
      return { t, event: 'Screen viewed', detail: `Navigated to ${String(p.screenId ?? '')}.` };
    default:
      return { t, event: ev.type, detail: '' };
  }
}

function fingerprintFacts(d: AlertDetail): { k: string; v: string; ok: boolean }[] {
  const facts: { k: string; v: string; ok: boolean }[] = [];
  const fp = d.device?.fingerprint;
  if (fp) {
    if (fp.manufacturer || fp.model) facts.push({ k: 'Device', v: `${fp.manufacturer ?? ''} ${fp.model ?? ''}`.trim(), ok: true });
    if (fp.androidRelease) facts.push({ k: 'OS', v: `Android ${fp.androidRelease}`, ok: true });
    if (fp.timezone) facts.push({ k: 'Timezone', v: String(fp.timezone), ok: true });
    if (fp.locale) facts.push({ k: 'Locale', v: String(fp.locale), ok: true });
  }
  if (d.install_id) facts.push({ k: 'Install', v: shortRef(d.install_id, 12), ok: true });
  if (d.device) {
    facts.push({ k: 'Device first seen', v: new Date(d.device.first_seen).toLocaleDateString(), ok: true });
  }
  const integ = d.timeline.find((e) => e.type === 'PASSIVE_APP_INTEGRITY')?.payload;
  if (integ) {
    const sideloaded = 'installerPackage' in integ &&
      ['', 'com.android.packageinstaller', 'com.google.android.packageinstaller']
        .includes(String(integ.installerPackage));
    const bad = integ.rootLikely || integ.hookingFramework || integ.emulatorLikely ||
      integ.debuggable || sideloaded;
    facts.push({ k: 'Integrity', v: bad ? 'Risk detected' : 'Clean', ok: !bad });
  }
  return facts;
}

export function AlertReview() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const canAct = (session?.rank ?? 0) >= 2;   // senior+ for the action channel

  const { data, loading, error, reload } = useApi<AlertDetail>(
    () => consoleApi.alert(alertId!), [alertId]);

  useConsoleTitle(data ? `Alert review — ${data.id}` : 'Alert review');

  const [busy, setBusy] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [disposition, setDisposition] = useState('');
  const [dispositionMsg, setDispositionMsg] = useState<string | null>(null);
  const [caseMsg, setCaseMsg] = useState<string | null>(null);

  const [replayStep, setReplayStep] = useState(0);
  const [replayPlaying, setReplayPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  if (loading) {
    return (
      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Skeleton w={140} h={12} />
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22, display: 'flex', gap: 20, alignItems: 'center' }}>
          <Skeleton w={64} h={64} r={4} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Skeleton w={90} h={18} />
              <Skeleton w={130} h={22} r={11} />
            </div>
            <Skeleton w="55%" h={12} />
            <Skeleton w="80%" h={12} />
          </div>
          <Skeleton w={150} h={38} r={3} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <Skeleton w={130} h={15} style={{ marginBottom: 18 }} />
            <SkeletonLines n={4} gap={18} />
          </div>
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <Skeleton w={150} h={15} style={{ marginBottom: 18 }} />
            <SkeletonLines n={3} gap={16} />
          </div>
        </div>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ fontFamily: 'Barlow', fontSize: 16, fontWeight: 700 }}>Alert not found</div>
        <div style={{ fontSize: 13, color: '#7A8593', marginTop: 6 }}>{error?.message || 'This alert no longer exists.'}</div>
        <button type="button" onClick={() => navigate('/console/alerts')}
          style={{ marginTop: 14, padding: '10px 16px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3, fontFamily: 'Barlow', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Back to queue
        </button>
      </div>
    );
  }

  const timeline: TimelineStep[] = data.timeline.map(presentEvent);
  const facts = fingerprintFacts(data);
  const txn = data.txn as { txnRef?: string; amount?: number; currency?: string; decision?: string } | null;
  const txnDecision = (txn?.decision as string) || 'Held';
  const heldTxn = !!txn?.txnRef;
  const n = Math.max(1, timeline.length);
  const step = Math.min(replayStep, n - 1);
  const cur = timeline[step] ?? { t: '', event: '—', detail: '' };

  const stopReplay = () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null; };
  const toggleReplay = () => {
    if (replayPlaying) { stopReplay(); setReplayPlaying(false); return; }
    const start = step >= n - 1 ? 0 : step;
    setReplayStep(start); setReplayPlaying(true);
    timerRef.current = setInterval(() => {
      setReplayStep((s) => { if (s >= n - 1) { stopReplay(); setReplayPlaying(false); return s; } return s + 1; });
    }, 1400);
  };
  const goToStep = (j: number) => { stopReplay(); setReplayPlaying(false); setReplayStep(j); };

  const runAction = async (kind: string, note: string, ok: string) => {
    setBusy(kind); setActionMsg(null);
    try {
      const a = await consoleApi.postAction(data.id, kind, note);
      setActionMsg(`${ok} · core-banking webhook: ${a.webhook_status}`);
      reload();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : 'Action failed.');
    } finally {
      setBusy(null);
    }
  };

  const applyDisposition = async (state: string | undefined, label: string) => {
    setDispositionMsg(null);
    try {
      const res = await consoleApi.patchAlert(data.id, { state, disposition: disposition || label });
      setDispositionMsg(res.aml_case_id
        ? `✓ ${label} AML file ${res.aml_case_id} opened automatically — funds moved after compromise.`
        : `✓ ${label}`);
      reload();
    } catch (e) {
      setDispositionMsg(e instanceof Error ? e.message : 'Could not save disposition.');
    }
  };

  const openCase = async () => {
    setCaseMsg(null);
    try {
      const r = await consoleApi.openCase(data.id, { assignee: session?.name });
      setCaseMsg(`✓ Case ${r.caseId} opened and linked to this alert.`);
      reload();
    } catch (e) {
      setCaseMsg(e instanceof Error ? e.message : 'Could not open a case.');
    }
  };

  const actBtn = (label: string, onClick: () => void, primary: boolean) => (
    <button
      type="button"
      disabled={!canAct || !!busy}
      onClick={onClick}
      title={canAct ? undefined : 'Requires senior analyst role or higher'}
      style={{
        padding: '10px 16px', borderRadius: 3, fontFamily: 'Barlow', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase', cursor: canAct && !busy ? 'pointer' : 'not-allowed',
        opacity: canAct ? 1 : 0.5,
        background: primary ? '#D71A28' : '#fff', color: primary ? '#fff' : '#2FBF71',
        border: primary ? 'none' : '1px solid #2FBF71',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: '24px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button
        type="button"
        onClick={() => navigate('/console/alerts')}
        style={{
          alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          background: 'transparent', border: 'none', color: '#5A6976', fontFamily: 'Barlow', fontSize: 12,
          fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
        }}
      >
        ← Back to alert queue
      </button>

      {/* HEADER */}
      <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ width: 72, height: 72, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: '#fff', flexShrink: 0, background: scoreColor(data.score) }}>
          <div style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 26, lineHeight: 1 }}>{data.score}</div>
          <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>Risk</div>
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 20, fontWeight: 800, color: '#1D1D1B' }}>{data.id}</div>
            {data.threat_type && <Chip color={threatColor(data.threat_type)}>{data.threat_type}</Chip>}
            <Chip color={stateColors[data.state] || '#7A8593'}>{data.state}</Chip>
          </div>
          <div style={{ fontSize: 13, color: '#5A6976', marginTop: 6 }}>
            {data.user_ref ? (
              <>Subject <button type="button" onClick={() => navigate(`/console/customers/${data.user_ref}`)}
                title={data.user_ref}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#3E4753', fontWeight: 700, borderBottom: '1px dotted #C9CED4' }}>
                {subjectLabel(data.user_ref, 16)}</button>
                {' '}<span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9AA4AF' }}>{shortRef(data.user_ref, 10)}</span></>
            ) : data.account_ref ? <>Account <span style={{ fontFamily: 'monospace' }}>{shortRef(data.account_ref, 16)}</span></> : 'No bound subject'}
            {' · '}detected {new Date(data.created_at).toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {data.case_id ? (
            <button type="button" onClick={() => navigate('/console/cases')}
              style={{ padding: '11px 18px', background: '#fff', color: '#3E4753', border: '1px solid #E0E5EA', borderRadius: 3, fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Case {data.case_id}
            </button>
          ) : (
            <button type="button" onClick={openCase}
              style={{ padding: '11px 18px', background: '#fff', color: '#3E4753', border: '1px solid #E0E5EA', borderRadius: 3, fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Open case
            </button>
          )}
          {data.session_id && actBtn(
            data.state === 'Contained' ? 'Session contained' : 'Terminate session',
            () => runAction('TERMINATE_SESSION', 'Analyst kill switch', '✓ Terminate command queued to device'),
            true)}
        </div>
      </div>

      {caseMsg && (
        <div style={{ padding: '12px 14px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4, fontSize: '12.5px', fontWeight: 700, color: '#2FBF71' }}>{caseMsg}</div>
      )}
      {actionMsg && (
        <div style={{ padding: '12px 14px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4, fontSize: '12.5px', fontWeight: 700, color: '#3E4753' }}>{actionMsg}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* SESSION TIMELINE */}
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Session timeline</div>
              <div style={{ fontSize: 12, color: '#7A8593' }}>
                {data.session_id ? `session ${shortRef(data.session_id, 8)} · ${timeline.length} events` : 'ledger-originated alert'}
              </div>
            </div>
            {timeline.length === 0 ? (
              <div style={{ fontSize: '12.5px', color: '#7A8593', marginTop: 14 }}>
                No session events — this alert was raised by the bank-feed ledger detector.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
                {timeline.map((ev, j) => (
                  <div key={j} style={{ display: 'grid', gridTemplateColumns: '76px 14px 1fr', gap: 12 }}>
                    <div style={{ fontFamily: 'Barlow', fontSize: '11px', fontWeight: 700, color: '#7A8593', paddingTop: 2, textAlign: 'right' }}>{ev.t}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: ev.flag ? flagColors[ev.flag] : '#C9CED4' }} />
                      {j !== timeline.length - 1 && <span style={{ width: 2, flex: 1, background: '#E9EDF1' }} />}
                    </div>
                    <div style={{ paddingBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{ev.event}</div>
                        {ev.flag && (
                          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Barlow', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3, color: '#fff', background: flagColors[ev.flag] }}>{ev.flag}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#5A6976', marginTop: 3, lineHeight: 1.55 }}>{ev.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SESSION REPLAY */}
          {timeline.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Session replay</div>
                <div style={{ fontSize: 12, color: '#7A8593' }}>step {step + 1} of {n}</div>
                <button type="button" onClick={toggleReplay}
                  style={{ marginLeft: 'auto', padding: '8px 16px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3, fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  {replayPlaying ? '❚❚ Pause' : '▶ Play'}
                </button>
              </div>
              <div style={{ marginTop: 16, background: '#1D1D1B', borderRadius: 4, padding: '26px 28px', minHeight: 130, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A8F94' }}>{cur.t}</span>
                  {cur.flag && (
                    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Barlow', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3, color: '#fff', background: flagColors[cur.flag] }}>{cur.flag}</span>
                  )}
                </div>
                <div style={{ fontFamily: 'Barlow', fontSize: 19, fontWeight: 700, color: '#fff', marginTop: 8 }}>{cur.event}</div>
                <div style={{ fontSize: 13, color: '#B9BDC1', marginTop: 6, lineHeight: 1.6 }}>{cur.detail}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 16, padding: '0 6px' }}>
                {timeline.map((ev, j) => (
                  <button key={j} type="button" title={ev.event} onClick={() => goToStep(j)}
                    style={{ flex: 1, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', borderTop: `2px solid ${j <= step ? '#D71A28' : '#E9EDF1'}` }}>
                    <span style={{ width: j === step ? 14 : 10, height: j === step ? 14 : 10, borderRadius: '50%', marginTop: -16, border: '2px solid #fff', boxShadow: '0 0 0 1px #E3E7EB', background: ev.flag ? flagColors[ev.flag] : j <= step ? '#D71A28' : '#C9CED4', transition: 'all .2s' }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TRANSACTION UNDER REVIEW */}
          {heldTxn && (
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Transaction under review</div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 18, padding: '16px 18px', background: '#FBF1F2', border: '1px solid #F2D9DB', borderRadius: 4, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Txn {txn?.txnRef}</div>
                  <div style={{ fontSize: '12.5px', color: '#5A6976', marginTop: 3 }}>Held pending analyst decision</div>
                </div>
                {txn?.amount != null && <div style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 22, color: '#1D1D1B' }}>{Number(txn.amount).toLocaleString()} {txn.currency || ''}</div>}
                <Chip color={txnDecision === 'Held' ? '#D71A28' : txnDecision === 'Released' ? '#2FBF71' : '#B8121F'}>{txnDecision}</Chip>
              </div>
              {txnDecision === 'Held' && (
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  {actBtn('Release payment', () => runAction('RELEASE_PAYMENT', 'Analyst released the held payment', '✓ Payment released'), false)}
                  {actBtn('Block payment', () => runAction('BLOCK_PAYMENT', 'Analyst blocked the held payment', '✕ Payment blocked'), true)}
                </div>
              )}
            </div>
          )}

          {/* ANALYST DISPOSITION */}
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Analyst disposition</div>
            <textarea
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
              placeholder="Investigation notes — saved on the alert record…"
              style={{ width: '100%', marginTop: 14, padding: '12px 14px', border: '1px solid #E0E5EA', borderRadius: 4, fontFamily: 'Open Sans', fontSize: 13, color: '#3E4753', minHeight: 76, resize: 'vertical', background: '#F7F8FA', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => applyDisposition('Resolved', 'Fraud confirmed — alert resolved.')}
                style={{ padding: '12px 18px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3, fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Confirm fraud — resolve
              </button>
              <button type="button" onClick={() => applyDisposition('Resolved', 'Closed as false positive.')}
                style={{ padding: '12px 18px', background: '#fff', color: '#2FBF71', border: '1px solid #2FBF71', borderRadius: 3, fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                False positive — close
              </button>
              <button type="button" onClick={() => applyDisposition(undefined, 'Customer callback scheduled — alert stays open.')}
                style={{ padding: '12px 18px', background: '#fff', color: '#3E4753', border: '1px solid #E0E5EA', borderRadius: 3, fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Contact customer
              </button>
            </div>
            {dispositionMsg && (
              <div style={{ marginTop: 14, padding: '12px 14px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4, fontSize: '12.5px', fontWeight: 700, color: '#2FBF71' }}>{dispositionMsg}</div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* BEHAVIORAL SIGNALS — real, from the scoring engine */}
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Behavioral signals</div>
            <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>What the scoring engine flagged · total {data.score}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              {(data.signals as ServerSignal[]).length === 0 && (
                <div style={{ fontSize: '12.5px', color: '#7A8593' }}>No individual signals recorded.</div>
              )}
              {(data.signals as ServerSignal[]).map((sg) => (
                <div key={sg.code} style={{ padding: '10px 12px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E262E' }}>{sg.label}</span>
                    <span style={{ fontFamily: 'Barlow', fontSize: 12, fontWeight: 800, color: '#D71A28' }}>+{sg.weight}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#5A6976', marginTop: 3, lineHeight: 1.5 }}>{sg.evidence}</div>
                </div>
              ))}
            </div>
          </div>

          {/* DEVICE & NETWORK */}
          {facts.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Device &amp; fingerprint</div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
                {facts.map((fc) => (
                  <div key={fc.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '9px 0', borderBottom: '1px solid #F0F2F5', fontSize: '12.5px' }}>
                    <span style={{ color: '#7A8593', whiteSpace: 'nowrap' }}>{fc.k}</span>
                    <span style={{ fontWeight: 700, textAlign: 'right', color: fc.ok ? '#3E4753' : '#D71A28' }}>{fc.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEDGER (feed-originated alerts) */}
          {data.bankTxns.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Account ledger</div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
                {data.bankTxns.map((tx) => (
                  <div key={tx.txn_ref} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '9px 0', borderBottom: '1px solid #F0F2F5', fontSize: '12.5px' }}>
                    <span style={{ color: tx.direction === 'OUT' ? '#D71A28' : '#2FBF71', fontWeight: 700 }}>{tx.direction}</span>
                    <span style={{ flex: 1, color: '#7A8593', fontFamily: 'monospace' }}>{shortRef(tx.counterparty_ref, 10)}</span>
                    <span style={{ fontWeight: 700 }}>{Number(tx.amount).toLocaleString()} {tx.currency || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRIOR ALERTS ON SUBJECT */}
          <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Prior alerts on subject</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {data.priorAlerts.length === 0 && <div style={{ fontSize: '12.5px', color: '#7A8593' }}>No prior alerts on this subject.</div>}
              {data.priorAlerts.map((pa) => (
                <button key={pa.id} type="button" onClick={() => navigate(`/console/alerts/${pa.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '12.5px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: pa.state === 'Resolved' ? '#2FBF71' : '#D71A28' }} />
                  <span style={{ fontWeight: 700, color: '#3E4753' }}>{pa.id}</span>
                  <span style={{ flex: 1, color: '#5A6976', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pa.signal}</span>
                  <span style={{ color: '#7A8593' }}>{pa.score}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
