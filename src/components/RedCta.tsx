import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CONTACT_EMAIL } from './Footer';

export function RedCta() {
  const { t, lang } = useLanguage();
  const [phone, setPhone] = useState('');

  // The site has no backend — demo requests go over mailto, same channel as
  // the footer. The form's job is to capture the number at the moment of
  // intent so the compose window opens with scheduling details pre-filled,
  // instead of asking the prospect to remember to include them.
  function requestDemo(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(lang === 'fr' ? 'Démo VeraWall (30 min)' : 'VeraWall demo (30 min)');
    const body = encodeURIComponent(
      (lang === 'fr'
        ? 'Mon numéro pour planifier la démo : '
        : 'My number for scheduling the demo: ') + phone.trim(),
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

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
          <form
            onSubmit={requestDemo}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              maxWidth: 560,
              margin: '34px auto 0',
            }}
          >
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('Your phone number')}
              aria-label={t('Your phone number')}
              autoComplete="tel"
              style={{
                flex: '1 1 240px',
                minWidth: 0,
                padding: '16px 18px',
                borderRadius: 3,
                border: 'none',
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 15.5,
                color: '#1D1D1B',
                background: '#fff',
              }}
            />
            <button type="submit" className="btn-primary-inverse" style={{ border: 'none', cursor: 'pointer' }}>
              {t('Request a demo')}
            </button>
          </form>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.94)', marginTop: 16 }}>
            {t('Opens your mail client with the details pre-filled — or write to us directly:')}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#fff', textDecoration: 'underline' }}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
