import type { Stat } from '../data/solutionPages';
import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';

export function StatsGrid({ title, stats }: { title: string; stats: Stat[] }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 15px 90px' }}>
      <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 700, textAlign: 'center', color: '#5A6976', textWrap: 'balance' }}>{t(title)}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 28, maxWidth: 1080, margin: '52px auto 0' }}>
        {stats.map((st) => (
          <div key={st.label} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 8, padding: '44px 36px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: isMobile ? 46 : 56, fontWeight: 800, color: '#D71A28', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{st.value}</div>
            <div style={{ fontSize: 17, color: '#3E4753', fontWeight: 600, marginTop: 18, lineHeight: 1.55 }}>{t(st.label)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
