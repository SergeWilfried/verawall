import { useParams } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useIsMobile } from '../useMediaQuery';
import { solutionPages, solutionOrder } from '../data/solutionPages';
import { Breadcrumb } from '../components/Breadcrumb';
import { StatsGrid } from '../components/StatsGrid';
import { CardsGrid } from '../components/CardsGrid';
import { RedCta } from '../components/RedCta';
import { Seo } from '../components/Seo';
import { SolutionArt, artKindForSlug } from '../components/SolutionArt';
import { MoneyFlowGraph } from '../components/MoneyFlowGraph';

export function SolutionDetail() {
  const { slug = '' } = useParams();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const page = solutionPages[slug];
  if (!page) return <Navigate to="/solutions/app-scams" replace />;

  const related = solutionOrder
    .filter((s) => s !== slug)
    .slice(0, 5)
    .map((s) => ({ title: solutionPages[s].title, href: `/solutions/${s}` }));

  return (
    <>
      <Seo title={page.title} description={page.intro} />

      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: page.category, to: '/' },
          ...(page.isSub ? [{ label: page.title }] : []),
        ]}
      />

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: -120,
            width: 640,
            height: 640,
            backgroundImage: 'radial-gradient(#D71A28 1px, transparent 1.2px)',
            backgroundSize: '22px 22px',
            opacity: 0.1,
            maskImage: 'radial-gradient(circle at 60% 40%, rgba(0,0,0,0.9), transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at 60% 40%, rgba(0,0,0,0.9), transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: isMobile ? '56px 15px 64px' : '96px 15px 110px' }}>
          <h1 style={{ fontSize: isMobile ? 40 : 64, lineHeight: 1.04, fontWeight: 800, textTransform: 'uppercase', color: '#D71A28', maxWidth: 860, textWrap: 'balance' }}>
            {t(page.title)}
          </h1>
          <h2 style={{ fontSize: isMobile ? 21 : 27, lineHeight: 1.35, fontWeight: 700, marginTop: 26, maxWidth: 760 }}>{t(page.sub)}</h2>
          <p style={{ fontSize: 17, color: '#5A6976', marginTop: 20, maxWidth: 760, lineHeight: 1.75 }}>{t(page.intro)}</p>
          <a href="#contact" className="btn-primary" style={{ marginTop: 34 }}>
            {t('Request a demo')}
          </a>
        </div>
      </section>

      <StatsGrid title={page.statsTitle} stats={page.stats} />

      {/* HOW IT SHOWS UP — VeraWall-built illustration band (no external images).
          Money mules gets the interactive 3D follow-the-money graph; the rest
          get the 2D composition. */}
      {slug === 'money-mules' ? (
        <MoneyFlowGraph title={page.artTitle ?? 'Follow the money.'} />
      ) : (
        <SolutionArt kind={artKindForSlug(slug)} title={page.artTitle ?? 'How it shows up in the session.'} />
      )}

      {/* SPOT IN REAL-TIME */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '48px 15px 72px' : '72px 15px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.85fr 1.15fr', gap: isMobile ? 24 : 64, alignItems: 'start' }}>
          <h2 style={{ fontSize: isMobile ? 28 : 40, lineHeight: 1.18, fontWeight: 700, color: '#5A6976', position: isMobile ? 'static' : 'sticky', top: 110, textWrap: 'balance' }}>
            {t(page.spotTitle)}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, fontSize: '16.5px', color: '#3E4753', lineHeight: 1.75 }}>
            {page.paras.map((text) => (
              <p key={text}>{t(text)}</p>
            ))}
          </div>
        </div>
      </section>

      <CardsGrid title={page.cardsTitle} cards={page.cards} />

      {/* RELATED PAGES */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '70px 15px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Barlow', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A8593' }}>
            More solutions:
          </span>
          {related.map((rl) => (
            <Link key={rl.href} to={rl.href} className="pill-link">
              {t(rl.title)}
            </Link>
          ))}
          <Link to="/instant-payment-scams" className="pill-link">
            {t('Instant Payment Scams')}
          </Link>
        </div>
      </section>

      <RedCta />
    </>
  );
}
