import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';
import { DemoRequestForm } from './DemoRequestForm';
import { CONTACT_EMAIL } from './contact';

// The footer doubles as the contact block (#contact).
export { CONTACT_EMAIL } from './contact';

export function Footer() {
  const { t, lang } = useLanguage();
  const isMobile = useIsMobile();
  const year = new Date().getFullYear();
  const subject = encodeURIComponent(lang === 'fr' ? 'Démo VeraWall (30 min)' : 'VeraWall demo (30 min)');

  return (
    <div id="contact" style={{ background: '#1D1D1B', color: '#EAEAEA', marginTop: 40 }}>
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: isMobile ? '56px 15px 0' : '110px 15px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
            gap: isMobile ? 40 : 72,
            alignItems: 'start',
            paddingBottom: isMobile ? 48 : 90,
            borderBottom: '1px solid rgba(255,255,255,0.16)',
          }}
        >
          <div>
            <h2 style={{ fontSize: isMobile ? 34 : 58, lineHeight: 1.05, fontWeight: 800, textTransform: 'uppercase', color: '#D71A28', textWrap: 'balance' }}>
              {t('Stop the next transfer, not the last one')}
            </h2>
          </div>
          <div>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{t('Plan your demo')}</h4>
            <p style={{ fontSize: 14, color: '#B9BDC1', marginTop: 12, lineHeight: 1.6 }}>
              {t('Opens your mail client with the details pre-filled — or write to us directly:')}{' '}
              <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}`} className="footer-link" style={{ color: '#EAEAEA' }}>{CONTACT_EMAIL}</a>
            </p>
            <DemoRequestForm dark />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1.2fr 1fr 1fr 1fr', gap: isMobile ? 32 : 48, padding: isMobile ? '48px 0' : '72px 0' }}>
          <div style={{ fontSize: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <svg width="26" height="26" viewBox="0 0 28 28" aria-hidden="true">
                <path d="M14 1 L26 5.5 V13 C26 20.5 21 25.5 14 27.5 C7 25.5 2 20.5 2 13 V5.5 Z" fill="#D71A28" />
                <path d="M8.5 9.5 L14 19.5 L19.5 9.5" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 20, color: '#fff' }}>VeraWall</span>
            </div>
            <p style={{ color: '#B9BDC1', marginTop: 14, lineHeight: 1.65, fontSize: 14, maxWidth: 280 }}>
              {t('Behavioral intelligence for fraud prevention, built for mobile-first banking and mobile money.')}
            </p>
          </div>
          <div style={{ fontSize: 14 }}>
            <div style={{ fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 14, color: '#fff', marginBottom: 18 }}>
              {t('Platform')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#9DA2A7', fontFamily: 'Barlow', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 13 }}>
              <Link to="/#platform" className="footer-link">{t('Behavioral SDKs')}</Link>
              <Link to="/#platform" className="footer-link">{t('Real-time scoring')}</Link>
              <Link to="/#platform" className="footer-link">{t('Anti-scam interventions')}</Link>
              <Link to="/console/login" className="footer-link">{t('Analyst console')}</Link>
            </div>
          </div>
          <div style={{ fontSize: 14 }}>
            <div style={{ fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 14, color: '#fff', marginBottom: 18 }}>
              {t('Solutions')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#9DA2A7', fontFamily: 'Barlow', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 13 }}>
              <Link to="/solutions/app-scams" className="footer-link">{t('Scams & Social Engineering')}</Link>
              <Link to="/solutions/account-takeover" className="footer-link">{t('Account Takeover')}</Link>
              <Link to="/solutions/money-mules" className="footer-link">{t('Money Mules')}</Link>
              <Link to="/solutions/transaction-risk" className="footer-link">{t('Transaction Risk Analysis')}</Link>
            </div>
          </div>
          <div style={{ fontSize: 14 }}>
            <div style={{ fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 14, color: '#fff', marginBottom: 18 }}>
              {t('Resources')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#9DA2A7', fontFamily: 'Barlow', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 13 }}>
              <a href="/Verawall-Livre-Blanc-FR.pdf" className="footer-link" download>{t('Whitepaper (FR)')}</a>
              <Link to="/instant-payment-scams" className="footer-link">{t('Instant Payment Scams')}</Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">{t('Contact Us')}</a>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            padding: '32px 0 40px',
            borderTop: '1px solid rgba(255,255,255,0.16)',
          }}
        >
          <div style={{ fontSize: 13, color: '#8A8F94' }}>
            © VeraWall {year} &nbsp;|&nbsp; {t('All Rights Reserved')}
          </div>
          <div style={{ fontSize: 13, color: '#8A8F94' }}>
            {t('Market figures: GSMA, Mobile money fraud typologies and mitigation strategies, 2024.')}
          </div>
        </div>
      </div>
    </div>
  );
}
