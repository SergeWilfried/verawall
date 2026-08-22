import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CONTACT_EMAIL } from './contact';

// Phone capture for demo planning, shared by the red CTA card and the dark
// footer contact block. The site has no backend — submit opens the visitor's
// mail client with the subject and their number pre-filled, and the microcopy
// under the form says exactly that rather than implying a form was submitted.
//
// `dark` picks the button treatment for the surface: the red brand button on
// the dark footer, the white inverse button on the red gradient card.
export function DemoRequestForm({ dark = false }: { dark?: boolean }) {
  const { t, lang } = useLanguage();
  const [phone, setPhone] = useState('');

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
    <form
      onSubmit={requestDemo}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: dark ? 'flex-start' : 'center',
        gap: 12,
        maxWidth: 560,
        margin: dark ? '24px 0 0' : '34px auto 0',
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
          flex: '1 1 220px',
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
      <button
        type="submit"
        className={dark ? 'btn-primary' : 'btn-primary-inverse'}
        style={{ border: 'none', cursor: 'pointer' }}
      >
        {t('Request a demo')}
      </button>
    </form>
  );
}
