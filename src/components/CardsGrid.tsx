import type { Card } from '../data/solutionPages';
import { Icon } from './Icons';
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
          backgroundImage: 'radial-gradient(#D71A28 1px, transparent 1.2px)',
          backgroundSize: '22px 22px',
          opacity: 0.08,
          maskImage: 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.9), transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.9), transparent 70%)',
        }}
      />
      <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: '90px 15px 100px' }}>
        <h2 style={{ fontSize: 40, fontWeight: 700, textAlign: 'center', color: '#5A6976' }}>{t(title)}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, marginTop: 56 }}>
          {cards.map((cd) => (
            <div key={cd.title} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 8, padding: '48px 38px' }}>
              <Icon name={cd.icon} size={64} style={{ marginBottom: 30 }} />
              <h3 style={{ fontSize: 23, fontWeight: 700 }}>{t(cd.title)}</h3>
              <p style={{ fontSize: '15.5px', color: '#5A6976', marginTop: 16, lineHeight: 1.75 }}>{t(cd.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
