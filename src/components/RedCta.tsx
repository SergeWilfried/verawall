import { useLanguage } from '../i18n/LanguageContext';

export function RedCta() {
  const { t } = useLanguage();

  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '70px 15px' }}>
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
            background: "url('https://www.threatmark.com/wp-content/uploads/2023/09/background-4.jpg') center/cover",
            opacity: 0.25,
            mixBlendMode: 'multiply',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: '92px 48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 42, lineHeight: 1.15, fontWeight: 700, color: '#fff' }}>
            {t('Want to learn more about ?')}
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.94)', marginTop: 24, lineHeight: 1.7 }}>
            {t("Complete our form to discover more about 's comprehensive approach to fraud disruption.")}
          </p>
          <a href="#contact" className="btn-primary-inverse" style={{ marginTop: 34 }}>
            {t('Talk to a fraud fighter')}
          </a>
        </div>
      </div>
    </section>
  );
}
