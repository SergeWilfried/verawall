import type { Card } from '../data/solutionPages';
import { icons } from '../data/icons';
import { useLanguage } from '../i18n/LanguageContext';

export function CardsGrid({ title, cards }: { title: string; cards: Card[] }) {
  const { t } = useLanguage();

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#FBFBFC',
        borderTop: '1px solid #EEF1F4',
        borderBottom: '1px solid #EEF1F4',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -60,
          left: -140,
          width: 560,
          height: 560,
          background: "url('https://www.threatmark.com/wp-content/uploads/2023/09/background-3.webp') center/cover",
          opacity: 0.15,
        }}
      />
      <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: '90px 15px 100px' }}>
        <h2 style={{ fontSize: 40, fontWeight: 700, textAlign: 'center', color: '#5A6976' }}>{t(title)}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, marginTop: 56 }}>
          {cards.map((cd) => (
            <div key={cd.title} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 8, padding: '48px 38px' }}>
              <img src={icons[cd.icon]} alt="" style={{ width: 64, height: 64, marginBottom: 30 }} />
              <h3 style={{ fontSize: 23, fontWeight: 700 }}>{t(cd.title)}</h3>
              <p style={{ fontSize: '15.5px', color: '#5A6976', marginTop: 16, lineHeight: 1.75 }}>{t(cd.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
