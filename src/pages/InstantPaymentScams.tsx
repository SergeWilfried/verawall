import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';
import { Breadcrumb } from '../components/Breadcrumb';
import { StatsGrid } from '../components/StatsGrid';
import { CardsGrid } from '../components/CardsGrid';
import { RedCta } from '../components/RedCta';
import { Seo } from '../components/Seo';
import { instantPaymentStats, instantPaymentCards } from '../data/instantPayment';
import { SolutionArt } from '../components/SolutionArt';

export function InstantPaymentScams() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <>
      <Seo
        title="Instant Payment Scams"
        description="Instant payment scams exploit the speed and convenience of electronic transactions. See how  spots them in real time."
      />

      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Scams & Social Engineering', to: '/' },
          { label: 'Instant Payment Scams' },
        ]}
      />

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: -120,
            width: 640,
            height: 640,
            backgroundImage: 'radial-gradient(#D71A28 1px, transparent 1.2px)',
            backgroundSize: '22px 22px',
            opacity: 0.1,
            maskImage: 'radial-gradient(circle at 60% 40%, rgba(0,0,0,0.9), transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at 60% 40%, rgba(0,0,0,0.9), transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: isMobile ? '56px 15px 64px' : '96px 15px 110px' }}>
          <h1 style={{ fontSize: isMobile ? 40 : 64, lineHeight: 1.04, fontWeight: 800, textTransform: 'uppercase', color: '#D71A28', maxWidth: 820, textWrap: 'balance' }}>
            {t('Instant Payment Scams')}
          </h1>
          <h2 style={{ fontSize: isMobile ? 21 : 27, lineHeight: 1.35, fontWeight: 700, marginTop: 26, maxWidth: 760 }}>
            {t('Instant payment scams exploit the speed and convenience of electronic transactions.')}
          </h2>
          <p style={{ fontSize: 17, color: '#5A6976', marginTop: 20, maxWidth: 760, lineHeight: 1.75 }}>
            {t(
              "Preying on individuals' trust and the immediacy of online transactions, perpetrators use deceptive techniques to manipulate victims into making immediate payments under false pretenses. The widespread global adoption of instant payment methods has provided fertile ground.",
            )}
          </p>
          <a href="#contact" className="btn-primary" style={{ marginTop: 34 }}>
            {t('Request a demo')}
          </a>
        </div>
      </section>

      <StatsGrid title="The impact of instant payment fraud." stats={instantPaymentStats} />

      <SolutionArt kind="scam" title="How it shows up in the session." />

      {/* SPOT IN REAL-TIME */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '48px 15px 72px' : '72px 15px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.85fr 1.15fr', gap: isMobile ? 24 : 64, alignItems: 'start' }}>
          <h2 style={{ fontSize: isMobile ? 28 : 40, lineHeight: 1.18, fontWeight: 700, color: '#5A6976', position: isMobile ? 'static' : 'sticky', top: 110, textWrap: 'balance' }}>
            {t('Spot instant payment scams in real-time.')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, fontSize: '16.5px', color: '#3E4753', lineHeight: 1.75 }}>
            <p>
              {t(
                "Behavioral intelligence scores each transaction against the customer's own patterns in real time — flagging unusual amounts, frequencies or timing the moment they appear.",
              )}
            </p>
            <p>
              {t(
                'Because it learns typical behavior (login times, transaction types), it catches the deviations that signal coercion — and new scam methods that rule-based monitoring never sees.',
              )}
            </p>
            <p>
              {t(
                'VeraWall scores every payment in the context of the full session — device, network, behavior and the transaction itself — so friction lands only where risk demands it, and legitimate customers pay uninterrupted.',
              )}
            </p>
          </div>
        </div>
      </section>

      <CardsGrid title="Understanding instant payment fraud." cards={instantPaymentCards} />

      <RedCta />
    </>
  );
}
