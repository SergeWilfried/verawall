import { useLanguage } from '../i18n/LanguageContext';
import { DemoRequestForm } from './DemoRequestForm';

export function RedCta() {
  const { t } = useLanguage();
  return (
    <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '70px 15px' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: 6,
          overflow: 'hidden',
          background: 'linear-gradient(180deg,#3A0509 0%,#C2131F 12%,#D71A28 55%,#E0303C 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1.2px)',
            backgroundSize: '22px 22px',
            opacity: 0.12,
          }}
        />
        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: '92px 48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 42, lineHeight: 1.15, fontWeight: 700, color: '#fff', textWrap: 'balance' }}>
            {t('See it on your own traffic.')}
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.94)', marginTop: 24, lineHeight: 1.7 }}>
            {t('A 30-minute walkthrough of the demo bank, the scoring signals and the analyst console — then a pilot on a replay of your own transaction feed.')}
          </p>
          <DemoRequestForm />
        </div>
      </div>
    </section>
  );
}
