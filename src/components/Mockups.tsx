// Product visuals built in CSS/React — real screens from the VeraWall demo
// bank and console, rendered as illustrations. No external images.

import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';

const RED = '#D71A28';
const INK = '#1E262E';
const MUTED = '#5A6976';
const LINE = '#E3E7EB';

/** Phone frame showing the in-app anti-scam intervention (SCAM_WARNING). */
export function ScamWarningPhone({ scale = 1 }: { scale?: number }) {
  const { t } = useLanguage();
  return (
    <div
      aria-hidden="true"
      style={{
        width: 300 * scale,
        height: 600 * scale,
        borderRadius: 40 * scale,
        background: '#0F1418',
        padding: 12 * scale,
        boxShadow: '0 30px 60px rgba(20,30,40,0.25), 0 0 0 1px rgba(0,0,0,0.2)',
        flexShrink: 0,
      }}
    >
      <div style={{ width: '100%', height: '100%', borderRadius: 30 * scale, background: '#EEF1F5', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontSize: 13 * scale }}>
        <div style={{ height: 28 * scale, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <div style={{ width: 90 * scale, height: 8 * scale, borderRadius: 8, background: '#0F1418', marginBottom: -2 }} />
        </div>
        <div style={{ padding: 16 * scale, display: 'flex', flexDirection: 'column', gap: 12 * scale }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 * scale }}>
            <div style={{ width: 24 * scale, height: 24 * scale, borderRadius: 6 * scale, background: '#0A5BD3', color: '#fff', fontWeight: 800, fontSize: 10 * scale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>DB</div>
            <div style={{ fontWeight: 800, color: INK, fontSize: 14 * scale }}>Demo Bank</div>
          </div>

          <div style={{ background: '#FFF4E5', border: '1px solid #F0C37A', borderLeft: `4px solid #F0C37A`, borderRadius: 8 * scale, padding: 12 * scale, display: 'flex', gap: 10 * scale }}>
            <div style={{ fontSize: 16 * scale }}>📵</div>
            <div>
              <div style={{ fontWeight: 800, color: '#8A5200', fontSize: 12 * scale }}>{t('You are on a call')}</div>
              <div style={{ color: '#6B4C15', fontSize: 10.5 * scale, lineHeight: 1.45, marginTop: 3 * scale }}>
                {t('Nobody from your bank is on the line. If the caller is guiding you through a transfer, hang up now.')}
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 10 * scale, padding: 16 * scale, textAlign: 'center' }}>
            <div style={{ width: 42 * scale, height: 42 * scale, borderRadius: 21 * scale, background: '#C67C00', color: '#fff', fontSize: 20 * scale, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>
            <div style={{ fontWeight: 800, color: INK, fontSize: 15 * scale, marginTop: 10 * scale, lineHeight: 1.2 }}>{t('Is someone helping you with this payment?')}</div>
            <div style={{ color: MUTED, fontSize: 10.5 * scale, lineHeight: 1.5, marginTop: 8 * scale }}>
              {t('This transfer matches the pattern of coached payments to a “safe account”. Your bank will never ask you to do this.')}
            </div>
            <div style={{ marginTop: 12 * scale, background: '#0A5BD3', color: '#fff', borderRadius: 6 * scale, padding: `${9 * scale}px 0`, fontWeight: 700, fontSize: 11 * scale }}>
              {t('Cancel — this doesn’t feel right')}
            </div>
            <div style={{ marginTop: 8 * scale, border: `1px solid ${LINE}`, color: '#0A5BD3', borderRadius: 6 * scale, padding: `${9 * scale}px 0`, fontWeight: 700, fontSize: 11 * scale }}>
              {t('Nobody asked me — continue')}
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 10 * scale, padding: 12 * scale }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 * scale }}>
              <div style={{ width: 14 * scale, height: 14 * scale, borderRadius: 3, background: RED, color: '#fff', fontSize: 8 * scale, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>V</div>
              <div style={{ fontWeight: 800, fontSize: 10 * scale, color: INK }}>VeraWall</div>
              <div style={{ marginLeft: 'auto', fontWeight: 800, color: '#C67C00', fontSize: 10 * scale }}>STEP UP · 72</div>
            </div>
            <div style={{ marginTop: 6 * scale, color: MUTED, fontSize: 9.5 * scale }}>{t('APP Scam · intervention: SCAM_WARNING')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The decision card the bank backend receives from POST /v1/score. */
export function VerdictCard({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const signals: [number, string, string][] = [
    [35, t('Transaction during an active phone call'), t('VoIP call, speaker on')],
    [20, t('New payee paid immediately after adding'), t('payee added 40 s before transfer')],
    [25, t('Amount far above learned profile'), t('90 000 vs. median 5 000 over 3 approved payments')],
    [20, t('Screen sharing active on the device'), t('extra virtual display detected')],
  ];
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        maxWidth: compact ? 380 : 440,
        background: '#fff',
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        boxShadow: '0 24px 60px rgba(20,30,40,0.14)',
        padding: compact ? 18 : 22,
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: RED, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>V</div>
        <div>
          <div style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 14, color: INK }}>POST /v1/score</div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.1em', color: MUTED, fontWeight: 700 }}>{t('DECISION IN 120 MS')}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <div style={{ background: '#FBEAEC', color: RED, fontWeight: 800, fontFamily: 'Barlow', fontSize: 13, padding: '6px 12px', borderRadius: 999 }}>HOLD</div>
        <div style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 26, color: RED }}>100</div>
      </div>
      <div style={{ fontSize: 12.5, color: MUTED, marginTop: 8 }}>
        {t('Classification:')} <b style={{ color: INK }}>APP Scam</b> · {t('alert')} ALT-2041
      </div>
      <div style={{ marginTop: 10, background: '#F2F7FF', borderRadius: 6, padding: '8px 10px' }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.1em', fontWeight: 800, color: '#08419A' }}>{t('RECOMMENDED ACTION')}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: INK, marginTop: 2 }}>{t('Analyst review — payment held, session can be terminated')}</div>
      </div>
      <div style={{ marginTop: 6 }}>
        {signals.slice(0, compact ? 3 : 4).map(([w, label, ev]) => (
          <div key={label} style={{ display: 'flex', gap: 8, padding: '8px 0', borderTop: `1px solid ${LINE}` }}>
            <div style={{ fontFamily: 'Barlow', fontWeight: 800, color: RED, width: 30 }}>+{w}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: INK }}>{label}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{ev}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Cover of the VeraWall whitepaper (the real one in /marketing). */
export function WhitepaperCover({ width = 300 }: { width?: number }) {
  const { lang } = useLanguage();
  const fr = lang === 'fr';
  const h = width * 1.38;
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height: h,
        background: 'linear-gradient(160deg,#1D1D1B 0%,#2B1316 55%,#3A0509 100%)',
        borderRadius: 6,
        boxShadow: '0 30px 60px rgba(20,30,40,0.28), 0 0 0 1px rgba(255,255,255,0.06) inset',
        padding: width * 0.09,
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        fontFamily: 'Barlow',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'absolute', right: -width * 0.25, top: -width * 0.25, width: width * 0.7, height: width * 0.7, borderRadius: '50%', border: `${width * 0.08}px solid ${RED}`, opacity: 0.35 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: width * 0.06, height: width * 0.06, borderRadius: 3, background: RED }} />
        <div style={{ fontWeight: 800, fontSize: width * 0.055, letterSpacing: '0.02em' }}>VeraWall</div>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontSize: width * 0.04, letterSpacing: '0.16em', fontWeight: 700, color: RED, textTransform: 'uppercase' }}>{fr ? 'Livre blanc' : 'Whitepaper'}</div>
        <div style={{ fontSize: width * 0.095, lineHeight: 1.05, fontWeight: 800, marginTop: width * 0.03 }}>
          {fr ? "Arrêter la fraude avant que l'argent ne parte" : 'Stopping fraud before the money moves'}
        </div>
        <div style={{ fontSize: width * 0.045, lineHeight: 1.35, color: 'rgba(255,255,255,0.78)', marginTop: width * 0.04, fontFamily: "'Open Sans', sans-serif" }}>
          {fr ? "L'intelligence comportementale pour la banque mobile en Afrique" : 'Behavioral intelligence for mobile-first banking in Africa'}
        </div>
      </div>
    </div>
  );
}

/** Mini analyst-console alert queue. */
export function ConsoleMock() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const rows: [string, string, number, string, string][] = [
    ['ALT-2041', t('APP Scam'), 100, 'HOLD', t('Open')],
    ['ALT-2040', t('Account Takeover'), 92, 'HOLD', t('Assigned')],
    ['ALT-2039', t('Money Mule'), 88, 'HOLD', t('Case')],
    ['ALT-2037', t('Account Drain'), 85, 'HOLD', t('Contained')],
  ];
  return (
    <div aria-hidden="true" style={{ width: '100%', border: `1px solid ${LINE}`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 24px 60px rgba(20,30,40,0.12)', background: '#fff', fontFamily: "'Open Sans', sans-serif" }}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 150, background: '#1D1D1B', color: '#B9BDC1', padding: '16px 14px', fontSize: 11.5, fontFamily: 'Barlow', display: isMobile ? 'none' : 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 13, marginBottom: 6 }}>VeraWall</div>
          <div>{t('Overview')}</div>
          <div style={{ color: '#fff', fontWeight: 700 }}>{t('Alert queue')}</div>
          <div>{t('Cases')}</div>
          <div>{t('Follow the money')}</div>
          <div>{t('Detections')}</div>
          <div>{t('Settings')}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 14, color: INK }}>{t('Alert queue')}</div>
            <div style={{ fontSize: 10.5, color: MUTED }}>{t('Open')} · 12</div>
            <div style={{ marginLeft: isMobile ? 0 : 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[t('Release'), t('Block'), t('Terminate session')].map((a, i) => (
                <div key={a} style={{ fontSize: 9.5, fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.06em', padding: '5px 8px', borderRadius: 3, border: `1px solid ${i === 2 ? RED : LINE}`, color: i === 2 ? '#fff' : INK, background: i === 2 ? RED : '#fff', textTransform: 'uppercase' }}>{a}</div>
              ))}
            </div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {rows.map(([id, threat, score, band, state], i) => (
              <div key={id} style={{ display: 'grid', gridTemplateColumns: isMobile ? '64px 1fr 34px 48px' : '72px 1fr 40px 52px 70px', gap: 8, alignItems: 'center', padding: '9px 16px', fontSize: 11.5, background: i === 0 ? '#FBF1F2' : '#fff', borderBottom: `1px solid #EEF1F4` }}>
                <div style={{ fontFamily: 'Barlow', fontWeight: 700, color: INK }}>{id}</div>
                <div style={{ color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{threat}</div>
                <div style={{ fontFamily: 'Barlow', fontWeight: 800, color: RED, textAlign: 'right' }}>{score}</div>
                <div style={{ fontSize: 9.5, fontWeight: 800, color: RED, background: '#FBEAEC', borderRadius: 999, textAlign: 'center', padding: '2px 0' }}>{band}</div>
                {!isMobile && <div style={{ fontSize: 10, color: MUTED }}>● {state}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
