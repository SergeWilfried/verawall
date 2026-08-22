import { useEffect, useState } from 'react';
import { LocalizedLink as Link } from '../components/LocalizedLink';
import { useLanguage } from '../i18n/LanguageContext';
import { services, features, heroSlides, marketStats, marketStatsSource, scoreExample } from '../data/home';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icons';
import { ScamWarningPhone, VerdictCard, WhitepaperCover, ConsoleMock } from '../components/Mockups';
import { TrustBento } from '../components/TrustBento';
import { useIsMobile } from '../useMediaQuery';

const HERO_COUNT = heroSlides.length + 1; // + the static closing slide

function slideStyle(active: boolean): React.CSSProperties {
  return {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity .7s ease, transform .7s ease',
    opacity: active ? 1 : 0,
    transform: active ? 'translateY(0)' : 'translateY(20px)',
    pointerEvents: active ? 'auto' : 'none',
  };
}

// Subtle owned backdrop: a dot grid fading out — replaces the stock imagery.
const dotGrid: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 360,
  backgroundImage: 'radial-gradient(#D71A28 1px, transparent 1.2px)',
  backgroundSize: '22px 22px',
  opacity: 0.12,
  maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent)',
  WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent)',
};

function HeroVisual({ kind }: { kind: (typeof heroSlides)[number]['visual'] }) {
  if (kind === 'phone') return <ScamWarningPhone scale={0.72} />;
  if (kind === 'whitepaper') return <WhitepaperCover width={300} />;
  return <VerdictCard />;
}

export function Home() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [hero, setHero] = useState(0);

  useEffect(() => {
    const h = setInterval(() => setHero((s) => (s + 1) % HERO_COUNT), 7000);
    return () => clearInterval(h);
  }, []);

  const split: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? 28 : 56,
    alignItems: 'center',
    background: '#F7F8FA',
    borderRadius: 6,
    padding: isMobile ? 28 : 56,
  };

  return (
    <>
      <Seo
        title="Behavioral Intelligence for Fraud Prevention"
        description="VeraWall scores every payment in the context of the whole session — coached scams, account takeover, SIM swap, mules and agent fraud — for mobile-first banking."
      />

      {/* HERO */}
      <section id="top" style={{ position: 'relative', overflow: 'hidden', background: '#FFFFFF' }}>
        <div style={dotGrid} />
        <div
          style={{
            position: 'relative',
            maxWidth: 'var(--page-width)',
            margin: '0 auto',
            padding: '0 15px',
            minHeight: 'calc(100vh - 84px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', width: '100%', minHeight: 560 }}>
            {heroSlides.map((slide, i) => (
              <div key={slide.title} style={slideStyle(hero === i)} aria-hidden={hero !== i}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.05fr 0.95fr', gap: isMobile ? 28 : 48, alignItems: 'center', width: '100%' }}>
                  <div>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '7px 16px',
                        border: '1px solid #D71A28',
                        borderRadius: 3,
                        fontFamily: 'Barlow',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#D71A28',
                        marginBottom: 26,
                      }}
                    >
                      {t(slide.kicker)}
                    </div>
                    {/* Two deliberate lines: the plain half, then the red half. Copy is
                        sized (EN and FR) to fit the column at 54px so the break is exact. */}
                    <h1 style={{ fontSize: isMobile ? 38 : 54, lineHeight: 1.06, fontWeight: 800 }}>
                      <span style={{ display: 'block' }}>{t(slide.title)}</span>
                      <span style={{ display: 'block', color: '#D71A28' }}>{t(slide.titleAccent)}</span>
                    </h1>
                    <p style={{ fontSize: isMobile ? 16 : 19, color: '#5A6976', marginTop: 22, maxWidth: 520, lineHeight: 1.6 }}>{t(slide.body)}</p>
                    {slide.href ? (
                      <a href={slide.href} className="btn-primary" style={{ marginTop: 32, gap: 10, fontSize: 14 }} download>
                        {t(slide.cta)}
                      </a>
                    ) : (
                      <Link to={slide.to ?? '/#contact'} className="btn-primary" style={{ marginTop: 32, gap: 10, fontSize: 14 }}>
                        {t(slide.cta)}
                      </Link>
                    )}
                  </div>
                  <div style={{ display: isMobile ? 'none' : 'flex', justifyContent: 'center', animation: 'tmfloat 6s ease-in-out infinite' }}>
                    <HeroVisual kind={slide.visual} />
                  </div>
                </div>
              </div>
            ))}

            <div key="static" style={slideStyle(hero === HERO_COUNT - 1)} aria-hidden={hero !== HERO_COUNT - 1}>
              <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: isMobile ? 44 : 74, lineHeight: 1.02, fontWeight: 800, textTransform: 'uppercase', textWrap: 'balance' }}>
                  {t('Stop fraud')} <span style={{ color: '#D71A28' }}>{t('at the moment of payment')}</span>
                </h1>
                <p style={{ fontSize: isMobile ? 17 : 21, color: '#5A6976', marginTop: 26, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                  {t('One SDK in your app, one call from your backend, one console for your analysts. VeraWall decides in milliseconds — allow, step up, or hold.')}
                </p>
                <Link to="/#contact" className="btn-primary" style={{ marginTop: 34, gap: 10, padding: '17px 34px', fontSize: 14 }}>
                  {t('Request a demo →')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 34, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12, zIndex: 5 }}>
          {Array.from({ length: HERO_COUNT }).map((_, i) => (
            <button
              key={i}
              type="button"
              className="dot"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={hero === i}
              style={{ background: hero === i ? '#D71A28' : '#D9DEE3' }}
              onClick={() => setHero(i)}
            />
          ))}
        </div>
      </section>

      {/* INTRO / WHY */}
      <section id="why" style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '60px 15px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: 6,
            overflow: 'hidden',
            background: 'linear-gradient(180deg,#3A0509 0%,#C2131F 12%,#D71A28 55%,#E0303C 100%)',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1.2px)', backgroundSize: '22px 22px', opacity: 0.12 }} />
          <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: isMobile ? '56px 24px' : '100px 48px', textAlign: 'center' }}>
            <h2 style={{ fontSize: isMobile ? 30 : 44, lineHeight: 1.15, fontWeight: 700, color: '#fff', textWrap: 'balance' }}>
              {t('The right person. The right device. The wrong payment.')}
            </h2>
            <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.94)', marginTop: 28, lineHeight: 1.7 }}>
              {t(
                "Coached scams, SIM swaps and mule cash-outs pass every rule written for the last decade of fraud. The evidence is in the session itself — who is on the phone, what is on the screen, how the hands move, where the money goes next. VeraWall reads that evidence and acts on it before settlement.",
              )}
            </p>
            <Link to="/#platform" className="btn-primary-inverse" style={{ marginTop: 36 }}>
              {t('How VeraWall works')}
            </Link>
          </div>
        </div>
      </section>

      {/* FRAUD TYPE CARDS */}
      <section id="solutions" style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '80px 15px 60px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto 56px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? 28 : 40, lineHeight: 1.15, fontWeight: 700, textWrap: 'balance' }}>{t('From coached transfers to agent fraud.')}</h2>
          <p style={{ fontSize: 18, color: '#5A6976', marginTop: 24, lineHeight: 1.7 }}>
            {t(
              'One scoring engine covers the typologies that actually hit mobile-first banks: the signals come from the app session, from the device, and from your own transaction feed — and every decision explains itself.',
            )}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 24 }}>
          {services.map((svc) => {
            const inner = (
              <>
                <div style={{ width: 56, height: 56, marginBottom: 26 }}>
                  <Icon name={svc.icon} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700 }}>{t(svc.title)}</h3>
                <p style={{ fontSize: 15, color: '#5A6976', marginTop: 14, lineHeight: 1.65 }}>{t(svc.desc)}</p>
                {/* CTA pinned to the card bottom so it aligns across the row
                    regardless of title/body length (esp. the longer FR copy). */}
                <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                  <span className="btn-primary" style={{ display: 'inline-block', padding: '13px 24px', fontSize: 12 }}>
                    {t('Learn More')}
                  </span>
                </div>
              </>
            );
            return svc.to ? (
              <Link key={svc.title} to={svc.to} className="card-link">{inner}</Link>
            ) : (
              <div key={svc.title} className="card-link">{inner}</div>
            );
          })}
        </div>
      </section>

      {/* SCAMS SPLIT */}
      <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: isMobile ? '32px 16px' : '60px 32px' }}>
        <div style={split}>
          <div>
            <h2 style={{ fontSize: isMobile ? 26 : 34, lineHeight: 1.18, fontWeight: 700, textWrap: 'balance' }}>
              {t('The victim passes the OTP. The scam goes through.')}
            </h2>
            <p style={{ fontSize: '16.5px', color: '#5A6976', marginTop: 22, lineHeight: 1.7 }}>
              <span style={{ color: '#D71A28', fontWeight: 700 }}>96%</span>{' '}
              {t(
                'of mobile-money fraud is detected through a customer complaint, not by the system (GSMA, 2024). In a coached scam the real customer authorizes the payment, so identity checks prove nothing. VeraWall sees the coaching — the live call, the shared screen, the payee added seconds ago — and replaces the OTP with an anti-scam warning the victim has to read, while the payment is held.',
              )}
            </p>
            <Link to="/solutions/app-scams" className="btn-primary" style={{ marginTop: 28, padding: '15px 28px', fontSize: 13 }}>
              {t('Scams & Social Engineering')}
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ScamWarningPhone scale={isMobile ? 0.7 : 0.62} />
          </div>
        </div>
      </section>

      {/* ATO SPLIT */}
      <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: isMobile ? '0 16px 32px' : '0 32px 60px' }}>
        <div style={split}>
          <div style={{ display: 'flex', justifyContent: 'center', order: isMobile ? 2 : 1 }}>
            <VerdictCard compact />
          </div>
          <div style={{ order: isMobile ? 1 : 2 }}>
            <h2 style={{ fontSize: isMobile ? 26 : 34, lineHeight: 1.18, fontWeight: 700, textWrap: 'balance' }}>{t('Known account. Unknown hands.')}</h2>
            <p style={{ fontSize: '16.5px', color: '#5A6976', marginTop: 22, lineHeight: 1.7 }}>
              <span style={{ color: '#D71A28', fontWeight: 700 }}>79%</span>{' '}
              {t(
                'of mobile-money providers name SIM swap as a prevalent scheme (GSMA, 2024). A fresh install, a changed SIM, a remote-access tool drawing over the screen, credentials pasted rather than typed — each is a tell on its own; together they separate the owner from the imposter within the first seconds of the session, before any transfer is attempted.',
              )}
            </p>
            <Link to="/solutions/account-takeover" className="btn-primary" style={{ marginTop: 28, padding: '15px 28px', fontSize: 13 }}>
              {t('Account Takeover')}
            </Link>
          </div>
        </div>
      </section>

      {/* MARKET STATS */}
      <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '80px 15px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontFamily: 'Barlow', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D71A28' }}>
            {t('Mobile money, by the numbers')}
          </div>
          <h2 style={{ fontSize: isMobile ? 28 : 40, lineHeight: 1.15, fontWeight: 700, marginTop: 16, textWrap: 'balance' }}>{t("The market runs on rules. Fraud doesn't.")}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 20 }}>
          {marketStats.map((st) => (
            <div key={st.value} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 8, padding: isMobile ? '28px 20px' : '40px 30px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Barlow', fontSize: isMobile ? 40 : 54, fontWeight: 800, color: '#D71A28', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{st.value}</div>
              <div style={{ fontSize: 15, color: '#3E4753', fontWeight: 600, marginTop: 16, lineHeight: 1.5 }}>{t(st.label)}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12.5, color: '#7A8593', textAlign: 'center', marginTop: 22 }}>{t(marketStatsSource)}</p>
      </section>

      {/* CONSOLE */}
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '0 15px' }}>
        <div style={{ height: 1, background: '#E9EDF1' }} />
      </div>
      <section style={{ position: 'relative', padding: isMobile ? '56px 15px' : '90px 15px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 0.85fr', gap: isMobile ? 28 : 56, alignItems: 'center' }}>
          <div style={{ position: 'relative', order: isMobile ? 2 : 1 }}>
            <ConsoleMock />
          </div>
          <div style={{ order: isMobile ? 1 : 2 }}>
            <h2 style={{ fontSize: isMobile ? 28 : 40, lineHeight: 1.12, fontWeight: 700, textWrap: 'balance' }}>
              {t('From alert to action')} <span style={{ color: '#D71A28' }}>{t('in under a minute.')}</span>
            </h2>
            <p style={{ fontSize: 17, color: '#5A6976', marginTop: 22, lineHeight: 1.7 }}>
              {t(
                'Every held payment lands in the analyst console with its session timeline, device history, prior alerts and ledger flows. Analysts release or block the payment, terminate the session on the device, open a case and follow the money across counterparties — and a confirmed fraud automatically opens its AML file with the outbound-flow trace attached.',
              )}
            </p>
            <Link to="/console/login" className="btn-primary" style={{ marginTop: 28, padding: '15px 28px', fontSize: 13 }}>
              {t('See the analyst console')}
            </Link>
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '0 15px' }}>
        <div style={{ height: 1, background: '#E9EDF1' }} />
      </div>
      <section id="platform" style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '90px 15px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto 56px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? 28 : 40, lineHeight: 1.15, fontWeight: 700, textWrap: 'balance' }}>{t('One SDK. One call. One console.')}</h2>
          <p style={{ fontSize: 18, color: '#5A6976', marginTop: 22, lineHeight: 1.7 }}>
            {t(
              'The VeraWall platform runs from the customer’s device to the analyst’s screen. Behavioral capture, real-time scoring, in-app interventions and the action channel back into core banking are one integrated system — not four vendors.',
            )}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 24 }}>
          {features.map((f) => (
            <div key={f.n} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: '34px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 3,
                    background: '#FBF1F2',
                    color: '#D71A28',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Barlow',
                    fontWeight: 800,
                  }}
                >
                  {f.n}
                </div>
                <Icon name={f.icon} size={30} />
              </div>
              <h4 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{t(f.title)}</h4>
              <p style={{ fontSize: '14.5px', color: '#5A6976', marginTop: 12, lineHeight: 1.65 }}>{t(f.desc)}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr', gap: isMobile ? 24 : 40, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Barlow', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D71A28' }}>{t('Integration')}</div>
            <h3 style={{ fontSize: isMobile ? 24 : 30, lineHeight: 1.2, fontWeight: 700, marginTop: 12, textWrap: 'balance' }}>{t('Your backend asks one question. It gets a decision it can act on.')}</h3>
            <p style={{ fontSize: 16, color: '#5A6976', marginTop: 16, lineHeight: 1.7 }}>
              {t(
                'The SDK hands your app a signed session token; your backend forwards it with the payment to /v1/score and receives the decision, the score, the threat classification, the recommended intervention and every signal that fired — with its evidence. Retries are idempotent; a held payment can be released or blocked from the console or by webhook.',
              )}
            </p>
          </div>
          <pre
            style={{
              margin: 0,
              background: '#1D1D1B',
              color: '#EAEAEA',
              borderRadius: 8,
              padding: isMobile ? 18 : 24,
              fontSize: isMobile ? 11 : 12.5,
              lineHeight: 1.55,
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            {scoreExample}
          </pre>
        </div>
      </section>

      {/* SECURITY & PRIVACY BENTO */}
      <TrustBento />

      {/* RESOURCES */}
      <section style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '20px 15px 100px' }}>
        <div
          style={{
            fontFamily: 'Barlow',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#D71A28',
            marginBottom: 28,
            textAlign: 'center',
          }}
        >
          {t('Resources')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
          <a href="/Verawall-Livre-Blanc-FR.pdf" className="news-card" download>
            <div style={{ background: 'linear-gradient(135deg,#F7F8FA,#EEF1F4)', padding: '28px 32px 0', display: 'flex', justifyContent: 'center', overflow: 'hidden', height: 200, alignItems: 'flex-end' }}>
              <WhitepaperCover width={180} />
            </div>
            <div style={{ padding: '30px 32px' }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.35 }}>{t('Whitepaper — Stopping fraud before the money moves')}</h4>
              <p style={{ fontSize: '14.5px', color: '#5A6976', marginTop: 12, lineHeight: 1.65 }}>
                {t('Behavioral intelligence for mobile-first banking in Africa: why SIM-swap takeovers, coached transfers and agent fraud defeat rule-based controls, and a concrete adoption path. French edition.')}
              </p>
              <div className="btn-primary" style={{ display: 'inline-block', marginTop: 20, padding: '13px 24px', fontSize: 12 }}>
                {t('Download (PDF, FR)')}
              </div>
            </div>
          </a>
          <Link to="/#contact" className="news-card">
            <div style={{ background: '#1D1D1B', padding: 32, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ScamWarningPhone scale={0.28} />
              <div style={{ marginLeft: 24, color: '#fff', fontFamily: 'Barlow' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.14em', fontWeight: 700, color: '#D71A28' }}>DEMO BANK</div>
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, marginTop: 6 }}>{t('See a coached transfer get stopped')}</div>
              </div>
            </div>
            <div style={{ padding: '30px 32px' }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.35 }}>{t('Live demo — web and mobile')}</h4>
              <p style={{ fontSize: '14.5px', color: '#5A6976', marginTop: 12, lineHeight: 1.65 }}>
                {t('A demo bank app with the SDK embedded: sign in, pick a scenario — legitimate payment, new-payee takeover, coached transfer, investment-scam escalation, account drain — and watch the verdict, the signals and the in-app intervention in real time.')}
              </p>
              <div className="btn-primary" style={{ display: 'inline-block', marginTop: 20, padding: '13px 24px', fontSize: 12 }}>
                {t('Request a demo')}
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
