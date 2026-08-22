import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';
import { trustPoints } from '../data/home';
import { Icon } from './Icons';

// "Security and privacy by design", promoted from a footer column to its own
// section. The audience is the bank's security reviewer — the person who
// decides whether the SDK gets into the app — so the five guarantees read as
// review answers, not marketing bullets.
//
// Bento, not a uniform card grid: the two guarantees that decide evaluations
// (timing-only capture, least-privilege) get double-width tiles, and the
// least-privilege tile carries the footer's dark surface so the differentiator
// anchors the composition. Red stays reserved for risk and actions.
export function TrustBento() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const featured = trustPoints.filter(
    (p) => p.title === 'Timing, never content' || p.title === 'Least-privilege by design',
  );
  const rest = trustPoints.filter((p) => !featured.includes(p));

  const tile = (p: (typeof trustPoints)[number], big: boolean, dark: boolean) => (
    <div
      key={p.title}
      style={{
        gridColumn: isMobile ? 'auto' : big ? 'span 3' : 'span 2',
        background: dark ? '#1D1D1B' : '#fff',
        border: dark ? '1px solid #1D1D1B' : '1px solid #E3E7EB',
        borderRadius: 6,
        padding: big ? '34px 34px 38px' : '26px 26px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: big ? 18 : 14,
      }}
    >
      <Icon name={p.icon} size={big ? 32 : 24} style={dark ? { filter: 'brightness(0) invert(1)' } : undefined} />
      <div>
        <h3
          style={{
            fontFamily: 'Barlow',
            fontWeight: 700,
            fontSize: big ? 22 : 16.5,
            lineHeight: 1.25,
            color: dark ? '#fff' : '#1D1D1B',
            textWrap: 'balance',
          }}
        >
          {t(p.title)}
        </h3>
        <p
          style={{
            fontSize: big ? 15.5 : 14,
            color: dark ? '#B9BDC1' : '#5A6976',
            marginTop: big ? 12 : 8,
            lineHeight: 1.65,
            maxWidth: '52ch',
          }}
        >
          {t(p.desc)}
        </p>
      </div>
    </div>
  );

  return (
    <section style={{ background: '#F7F8FA' }}>
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: isMobile ? '56px 15px' : '90px 15px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto 44px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? 27 : 36, lineHeight: 1.16, fontWeight: 700, textWrap: 'balance' }}>
            {t('Security and privacy by design')}
          </h2>
          <p style={{ fontSize: 16.5, color: '#5A6976', marginTop: 16, lineHeight: 1.65 }}>
            {t('The five guarantees your security review will ask about — settled before the pilot starts.')}
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, 1fr)',
            gap: 16,
          }}
        >
          {featured.map((p) => tile(p, true, p.title === 'Least-privilege by design'))}
          {rest.map((p) => tile(p, false, false))}
        </div>
      </div>
    </section>
  );
}
