import { useLanguage } from '../i18n/LanguageContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { StatsGrid } from '../components/StatsGrid';
import { CardsGrid } from '../components/CardsGrid';
import { RedCta } from '../components/RedCta';
import { Seo } from '../components/Seo';
import { instantPaymentStats, instantPaymentCards } from '../data/instantPayment';

export function InstantPaymentScams() {
  const { t } = useLanguage();

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
        <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: '96px 15px 110px' }}>
          <h1 style={{ fontSize: 64, lineHeight: 1.04, fontWeight: 800, textTransform: 'uppercase', color: '#D71A28', maxWidth: 820 }}>
            {t('Instant Payment Scams')}
          </h1>
          <h2 style={{ fontSize: 27, lineHeight: 1.35, fontWeight: 700, marginTop: 26, maxWidth: 760 }}>
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

      {/* SPOT IN REAL-TIME */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 15px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 64, alignItems: 'start' }}>
          <h2 style={{ fontSize: 40, lineHeight: 1.18, fontWeight: 700, color: '#5A6976', position: 'sticky', top: 110 }}>
            {t('Spot instant payment scams in real-time.')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, fontSize: '16.5px', color: '#3E4753', lineHeight: 1.75 }}>
            <p>
              {t(
                'Behavioral intelligence is vital in combating instant payment scams by analyzing transaction patterns to detect anomalies. This technology enables real-time monitoring, flagging suspicious activities like unusual transaction amounts or frequencies.',
              )}
            </p>
            <p>
              {t(
                'By understanding typical customer behaviors, such as login times and transaction types, the system can spot deviations that may indicate coercion or fraud. This approach relies on predictive analysis, uncovering potential new scam trends and methods, which is impossible with traditional transaction monitoring.',
              )}
            </p>
            <p>
              {t(
                'The VeraWall Behavioral Intelligence Platform evaluates every payment in the context of the full user session — the device, the network, the behavior and the transaction itself — so stringent measures are applied only where risk demands it, and legitimate customers pay without friction.',
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
