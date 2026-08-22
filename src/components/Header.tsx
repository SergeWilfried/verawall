import { useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { solutionsMenu, platformTiles } from '../data/nav';
import { useMediaQuery } from '../useMediaQuery';

type MenuName = 'solutions' | 'platform' | null;

export function Header() {
  const { t, lang, setLang } = useLanguage();
  // Header switches to the hamburger below 960px, not the 768px content
  // breakpoint: the French desktop nav (POURQUOI VERAWALL · PLATEFORME
  // VERAWALL · DEMANDER UNE DÉMO) needs the extra room, and clipped past
  // ~900px otherwise.
  const isMobile = useMediaQuery('(max-width: 960px)');
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setOpenMenu(null);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') close();
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid #E9EDF1',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--page-width)',
          margin: '0 auto',
          padding: '0 15px',
          height: 84,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
            <svg width="30" height="30" viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
              <path d="M14 1 L26 5.5 V13 C26 20.5 21 25.5 14 27.5 C7 25.5 2 20.5 2 13 V5.5 Z" fill="#D71A28" />
              <path
                d="M8.5 9.5 L14 19.5 L19.5 9.5"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 22, letterSpacing: '0.01em', color: '#1E262E' }}>
              VeraWall
            </span>
          </span>
        </Link>

        {!isMobile && (
        <nav
          onMouseLeave={close}
          onKeyDown={onKeyDown}
          style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto', minWidth: 0, position: 'relative' }}
        >
          <Link to="/#why" className="nav-link">
            {t('Why VeraWall')}
          </Link>

          <div style={{ position: 'relative' }} onMouseEnter={() => setOpenMenu('solutions')}>
            <button
              type="button"
              className="nav-link"
              aria-haspopup="true"
              aria-expanded={openMenu === 'solutions'}
              onClick={() => setOpenMenu('solutions')}
              onFocus={() => setOpenMenu('solutions')}
            >
              {t('Solutions')} <span style={{ fontSize: 10, opacity: 0.5 }}>▾</span>
            </button>
          </div>

          <div style={{ position: 'relative' }} onMouseEnter={() => setOpenMenu('platform')}>
            <button
              type="button"
              className="nav-link"
              aria-haspopup="true"
              aria-expanded={openMenu === 'platform'}
              onClick={() => setOpenMenu('platform')}
              onFocus={() => setOpenMenu('platform')}
            >
              {t('VeraWall Platform')} <span style={{ fontSize: 10, opacity: 0.5 }}>▾</span>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 8,
              border: '1px solid #E0E5EA',
              borderRadius: 3,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <button type="button" className="lang-btn" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
              EN
            </button>
            <button type="button" className="lang-btn" aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>
              FR
            </button>
          </div>

          <Link
            to="/#contact"
            className="btn-primary"
            style={{ marginLeft: 8, padding: '12px 14px', fontSize: '11.5px', flexShrink: 0 }}
          >
            {t('Request a demo')}
          </Link>

          {/* Mega dropdown. Fixed + centered on the VIEWPORT (not the
              right-aligned nav, which pushed the panel off the right edge at
              narrow desktop widths — worse in French). Matches the page's
              1080 content column. */}
          <div
            style={{
              position: 'fixed',
              top: 85,
              left: 0,
              right: 0,
              margin: '0 auto',
              maxWidth: 'var(--page-width)',
              zIndex: 99,
              background: '#FFFFFF',
              border: '1px solid #E9EDF1',
              borderRadius: '0 0 6px 6px',
              boxShadow: '0 30px 60px rgba(30,40,50,0.14)',
              opacity: openMenu ? 1 : 0,
              visibility: openMenu ? 'visible' : 'hidden',
              transition: 'opacity .2s',
              marginTop: 1,
            }}
          >
            <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '28px 15px' }}>
              <div style={{ display: openMenu === 'solutions' ? 'block' : 'none' }}>
                <div
                  style={{
                    fontFamily: 'Barlow',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#D71A28',
                    marginBottom: 18,
                  }}
                >
                  {t('Solutions')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px 40px', alignItems: 'start' }}>
                  {solutionsMenu.map((column, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                      {column.map((group) => (
                        <div key={group.title}>
                          {group.to ? (
                            <Link to={group.to} className="mega-link-title" onClick={close}>
                              {t(group.title)}
                            </Link>
                          ) : (
                            <span className="mega-link-title" style={{ cursor: 'default' }}>
                              {t(group.title)}
                            </span>
                          )}
                          <div style={{ fontSize: 12, color: '#7A8593', marginTop: 4, lineHeight: 1.5 }}>
                            {t(group.sub)}
                          </div>
                          {group.links && (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                marginTop: 12,
                                fontSize: '12.5px',
                                fontWeight: 700,
                              }}
                            >
                              {group.links.map((link) =>
                                link.to ? (
                                  <Link key={link.title} to={link.to} className="mega-link-sub" onClick={close}>
                                    {t(link.title)}
                                  </Link>
                                ) : (
                                  <span key={link.title} className="mega-link-sub">
                                    {t(link.title)}
                                  </span>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: openMenu === 'platform' ? 'block' : 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40 }}>
                  <div>
                    <div
                      style={{
                        fontFamily: 'Barlow',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#D71A28',
                        marginBottom: 18,
                      }}
                    >
                      {t('VeraWall Platform')}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {platformTiles.map((tile) => (
                        <span key={tile.title} className="mega-tile" style={{ cursor: 'default' }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: '#3E4753' }}>{t(tile.title)}</div>
                          <div style={{ fontSize: 13, color: '#7A8593', marginTop: 3 }}>{t(tile.desc)}</div>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: '#FBF1F2', border: '1px solid #F2D9DB', borderRadius: 6, padding: 24 }}>
                    <div style={{ fontFamily: 'Barlow', fontWeight: 700, fontSize: 18, color: '#3E4753', marginBottom: 10 }}>
                      {t('From the device to the decision.')}
                    </div>
                    <div style={{ fontSize: 13, color: '#7A8593', lineHeight: 1.6 }}>
                      {t(
                        'Behavioral SDKs, real-time scoring, in-app interventions and an analyst console — one integrated platform built for mobile-first banking.',
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        )}

        {isMobile && (
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              marginLeft: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
              width: 44, height: 44, padding: 10, background: 'none', border: '1px solid #E0E5EA', borderRadius: 4, cursor: 'pointer',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block', height: 2, borderRadius: 2, background: '#1E262E',
                  transition: 'transform .2s, opacity .2s',
                  transform: mobileOpen ? (i === 0 ? 'translateY(7px) rotate(45deg)' : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none') : 'none',
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        )}
      </div>

      {isMobile && mobileOpen && (
        <div
          style={{
            borderTop: '1px solid #E9EDF1', background: '#fff', padding: '10px 15px 22px',
            maxHeight: 'calc(100vh - 84px)', overflowY: 'auto',
          }}
        >
          <Link to="/#why" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>
            {t('Why VeraWall')}
          </Link>

          <div className="mobile-nav-heading">{t('Solutions')}</div>
          {solutionsMenu.flat().map((group) => (
            <div key={group.title}>
              {group.to ? (
                <Link to={group.to} className="mobile-nav-item" onClick={() => setMobileOpen(false)}>{t(group.title)}</Link>
              ) : (
                <div className="mobile-nav-item" style={{ color: '#7A8593' }}>{t(group.title)}</div>
              )}
              {group.links?.map((link) =>
                link.to ? (
                  <Link key={link.title} to={link.to} className="mobile-nav-item mobile-nav-sub" onClick={() => setMobileOpen(false)}>
                    {t(link.title)}
                  </Link>
                ) : (
                  <div key={link.title} className="mobile-nav-item mobile-nav-sub" style={{ color: '#9AA4AF' }}>{t(link.title)}</div>
                ),
              )}
            </div>
          ))}

          <div className="mobile-nav-heading">{t('VeraWall Platform')}</div>
          {platformTiles.map((tile) => (
            <div key={tile.title} className="mobile-nav-item" style={{ color: '#5A6976' }}>{t(tile.title)}</div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20 }}>
            <div style={{ display: 'flex', border: '1px solid #E0E5EA', borderRadius: 3, overflow: 'hidden' }}>
              <button type="button" className="lang-btn" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
              <button type="button" className="lang-btn" aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>FR</button>
            </div>
            <Link
              to="/#contact"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '13px 14px', fontSize: '11.5px' }}
              onClick={() => setMobileOpen(false)}
            >
              {t('Request a demo')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
