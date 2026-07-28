import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';

export function Footer() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const year = new Date().getFullYear();

  return (
    <div id="contact" style={{ background: '#1D1D1B', color: '#EAEAEA', marginTop: 40 }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '56px 15px 0' : '110px 15px 0' }}>
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
            <h2 style={{ fontSize: isMobile ? 34 : 58, lineHeight: 1.05, fontWeight: 800, textTransform: 'uppercase', color: '#D71A28' }}>
              {t("Let's win the war against fraud")}
            </h2>
            <p style={{ fontSize: 19, color: '#EAEAEA', marginTop: 28, maxWidth: 560, lineHeight: 1.65 }}>
              {t(
                "Win your customers' loyalty by working with the best fraud fighters. With VeraWall at your side, anything is possible.",
              )}
            </p>
            <Link to="/#contact" className="btn-primary" style={{ marginTop: 36, padding: '17px 32px' }}>
              {t('Talk to a fraud fighter')}
            </Link>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 30 }}>
              <img
                src="https://www.threatmark.com/wp-content/uploads/2023/09/aicpa.svg"
                alt="AICPA SOC"
                style={{ height: 96, filter: 'brightness(0) invert(1)' }}
              />
              <img
                src="https://www.threatmark.com/wp-content/uploads/2023/09/iso.svg"
                alt="ISO 27001"
                style={{ height: 96, filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{t('VeraWall is ISO 27001 & SOC2 certified')}</h4>
            <p style={{ fontSize: '15.5px', color: '#B9BDC1', marginTop: 14, lineHeight: 1.7 }}>
              {t(
                'At VeraWall we take security and data protection very seriously. Our core focus is to ensure the highest security, safety and trust in the digital world throughout our work, processes, products and services.',
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1.2fr 1fr 1fr 1fr', gap: isMobile ? 32 : 48, padding: isMobile ? '48px 0' : '72px 0' }}>
          <div style={{ fontSize: 15 }}>
            <div style={{ display: 'grid', gap: 28 }}>
              <div>
                <div style={{ fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 14, color: '#fff' }}>
                  USA HQ
                </div>
                <div style={{ color: '#B9BDC1', marginTop: 6 }}>Charlotte, North Carolina</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 14, color: '#fff' }}>
                  Czech Republic
                </div>
                <div style={{ color: '#B9BDC1', marginTop: 6 }}>Brno</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 14, color: '#fff' }}>
                  United Kingdom
                </div>
                <div style={{ color: '#B9BDC1', marginTop: 6 }}>London</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 14 }}>
            <div style={{ fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 14, color: '#fff', marginBottom: 18 }}>
              {t('Products')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#9DA2A7', fontFamily: 'Barlow', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 13 }}>
              <a href="#" className="footer-link">{t('Behavioral Intelligence Platform')}</a>
              <a href="#" className="footer-link">{t('ScamFlag')}</a>
              <a href="#" className="footer-link">{t('Smart Insights')}</a>
              <a href="#" className="footer-link">{t('FraudIntel')}</a>
            </div>
          </div>
          <div style={{ fontSize: 14 }}>
            <div style={{ fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 14, color: '#fff', marginBottom: 18 }}>
              {t('Resources')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#9DA2A7', fontFamily: 'Barlow', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 13 }}>
              <a href="#" className="footer-link">{t('Resources')}</a>
              <a href="#" className="footer-link">{t('Insights')}</a>
              <a href="#" className="footer-link">{t('Newsroom')}</a>
            </div>
          </div>
          <div style={{ fontSize: 14 }}>
            <div style={{ fontFamily: 'Barlow', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 14, color: '#fff', marginBottom: 18 }}>
              {t('Company')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#9DA2A7', fontFamily: 'Barlow', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 13 }}>
              <a href="#" className="footer-link">{t('About Us')}</a>
              <a href="#" className="footer-link">{t('Careers')}</a>
              <a href="#" className="footer-link">{t('Partners')}</a>
              <Link to="/#contact" className="footer-link">{t('Contact Us')}</Link>
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
          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#9DA2A7' }}>
            <a href="#" className="footer-link">{t('Privacy Policy')}</a>
            <a href="#" className="footer-link">{t('Cookies')}</a>
            <a href="#" className="footer-link">{t('Code of Conduct')}</a>
            <a href="#" className="footer-link">{t('Whistleblower Protection')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
