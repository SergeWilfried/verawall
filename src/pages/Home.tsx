import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { services, features, testimonials, heroSlides } from '../data/home';
import { Seo } from '../components/Seo';

const HERO_COUNT = heroSlides.length + 1; // + the static "win the war" slide

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

export function Home() {
  const { t } = useLanguage();
  const [hero, setHero] = useState(HERO_COUNT - 1);
  const [testimonial, setTestimonial] = useState(0);

  useEffect(() => {
    const h = setInterval(() => setHero((s) => (s + 1) % HERO_COUNT), 6000);
    const tId = setInterval(() => setTestimonial((s) => (s + 1) % testimonials.length), 7000);
    return () => {
      clearInterval(h);
      clearInterval(tId);
    };
  }, []);

  const current = testimonials[testimonial];

  return (
    <>
      <Seo
        title="Behavioral Intelligence for Fraud Prevention"
        description="VeraWall's Behavioral Intelligence Platform disrupts scams, phishing, account takeover and money mule fraud in real time."
      />

      {/* HERO */}
      <section id="top" style={{ position: 'relative', overflow: 'hidden', background: '#FFFFFF' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 340,
            background: "url('https://www.threatmark.com/wp-content/uploads/2023/09/background-3.webp') top center/cover",
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: 'relative',
            maxWidth: 1080,
            margin: '0 auto',
            padding: '0 15px',
            minHeight: 'calc(100vh - 84px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', width: '100%', minHeight: 520 }}>
            {heroSlides.map((slide, i) => (
              <div key={slide.title} style={slideStyle(hero === i)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 48, alignItems: 'center', width: '100%' }}>
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
                    <h1 style={{ fontSize: 54, lineHeight: 1.06, fontWeight: 800 }}>
                      {t(slide.title)} <span style={{ color: '#D71A28' }}>{t(slide.titleAccent)}</span>
                    </h1>
                    <p style={{ fontSize: 19, color: '#5A6976', marginTop: 22, maxWidth: 520, lineHeight: 1.6 }}>{t(slide.body)}</p>
                    <a
                      href="#"
                      className="btn-primary"
                      style={{ marginTop: 32, gap: 10, fontSize: 14 }}
                      onClick={(e) => e.preventDefault()}
                    >
                      {t(slide.cta)}
                    </a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={slide.image}
                      alt=""
                      style={{ maxWidth: '100%', maxHeight: 440, animation: 'tmfloat 6s ease-in-out infinite' }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div key="static" style={slideStyle(hero === HERO_COUNT - 1)}>
              <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: 76, lineHeight: 1.02, fontWeight: 800, textTransform: 'uppercase' }}>
                  {t('Win the war')} <span style={{ color: '#D71A28' }}>{t('against fraud')}</span>
                </h1>
                <p style={{ fontSize: 21, color: '#5A6976', marginTop: 26, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                  {t(
                    "Protecting people and their transactions, one touch at a time. Let's fight this battle together: disrupt the fraud, win the war.",
                  )}
                </p>
                <Link to="/#contact" className="btn-primary" style={{ marginTop: 34, gap: 10, padding: '17px 34px', fontSize: 14 }}>
                  {t('Talk to a fraud fighter →')}
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
      <section id="why" style={{ maxWidth: 1080, margin: '0 auto', padding: '60px 15px' }}>
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
              background: "url('https://www.threatmark.com/wp-content/uploads/2023/09/background-4.jpg') center/cover",
              opacity: 0.25,
              mixBlendMode: 'multiply',
            }}
          />
          <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '100px 48px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 44, lineHeight: 1.15, fontWeight: 700, color: '#fff' }}>
              {t("Traditional fraud detection tools aren't cutting it.")}
            </h2>
            <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.94)', marginTop: 28, lineHeight: 1.7 }}>
              {t(
                'The evolving landscape of scams and social engineering tactics has made individuals more susceptible than ever. Our goal is clear: to usher in a new era where fighting fraud is no longer a one-time glimpse into the past but a constant monitoring of the now.',
              )}
            </p>
            <a href="#why" className="btn-primary-inverse" style={{ marginTop: 36 }}>
              {t('Why VeraWall')}
            </a>
          </div>
        </div>
      </section>

      {/* FRAUD TYPE CARDS */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 15px 60px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto 56px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 40, lineHeight: 1.15, fontWeight: 700 }}>{t('From scams to mules, VeraWall can help.')}</h2>
          <p style={{ fontSize: 18, color: '#5A6976', marginTop: 24, lineHeight: 1.7 }}>
            {t(
              "In this world of constantly increasing fraud threats, we've reimagined protection. We've created the means of disrupting the fraudsters' infrastructure — a platform that not only mitigates scams, phishing and unauthorized access, it interrupts fraud operations across all stages of the attack. We help stop fraud before it happens.",
            )}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {services.map((svc) => (
            <a key={svc.title} href="#" className="card-link" onClick={(e) => e.preventDefault()}>
              <div style={{ width: 56, height: 56, marginBottom: 26 }}>
                <img src={svc.icon} alt="" style={{ width: 56, height: 56 }} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700 }}>{t(svc.title)}</h3>
              <p style={{ fontSize: 15, color: '#5A6976', marginTop: 14, lineHeight: 1.65 }}>{t(svc.desc)}</p>
              <div className="btn-primary" style={{ display: 'inline-block', marginTop: 24, padding: '13px 24px', fontSize: 12 }}>
                {t('Learn More')}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SCAMS SPLIT */}
      <section style={{ maxWidth: 1050, aspectRatio: '1050 / 462', margin: '0 auto', padding: '60px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'center',
            background: '#F7F8FA',
            borderRadius: 6,
            padding: 56,
          }}
        >
          <div>
            <h2 style={{ fontSize: 34, lineHeight: 1.18, fontWeight: 700 }}>
              {t('Winning the war against scams and social engineering.')}
            </h2>
            <p style={{ fontSize: '16.5px', color: '#5A6976', marginTop: 22, lineHeight: 1.7 }}>
              <span style={{ color: '#D71A28', fontWeight: 700 }}>48%</span> {t(
                'of financial institution executives see scams and social engineering as the greatest modern threat. Traditional methods are ineffective as fraudsters now avoid direct interaction with banking platforms, preferring to manipulate victims directly. Winning this war requires arming organizations with the right tools at the right time.',
              )}
            </p>
            <a href="#" className="btn-primary" style={{ marginTop: 28, padding: '15px 28px', fontSize: 13 }} onClick={(e) => e.preventDefault()}>
              {t("VeraWall's Solutions")}
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="https://www.threatmark.com/wp-content/uploads/2025/01/image-2.webp" alt="" style={{ maxWidth: '100%', borderRadius: 6 }} />
          </div>
        </div>
      </section>

      {/* PHISHING SPLIT */}
      <section style={{ maxWidth: 1050, aspectRatio: '1050 / 462', margin: '0 auto', padding: '0 32px 60px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'center',
            background: '#F7F8FA',
            borderRadius: 6,
            padding: 56,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', order: 1 }}>
            <img
              src="https://www.threatmark.com/wp-content/uploads/2025/01/image-3.webp"
              alt=""
              style={{ maxWidth: '100%', borderRadius: 6 }}
            />
          </div>
          <div style={{ order: 2 }}>
            <h2 style={{ fontSize: 34, lineHeight: 1.18, fontWeight: 700 }}>{t('Enhance your defenses against phishing.')}</h2>
            <p style={{ fontSize: '16.5px', color: '#5A6976', marginTop: 22, lineHeight: 1.7 }}>
              {t('Phishing is the primary catalyst for over')} <span style={{ color: '#D71A28', fontWeight: 700 }}>90%</span>{' '}
              {t('of cyber attacks. Real-time detection and mitigation is crucial to limiting fraudsters\' opportunity to harvest sensitive data, safeguarding digital interactions and preventing the misuse of stolen credentials.')}
            </p>
            <Link to="/solutions/credential-theft" className="btn-primary" style={{ marginTop: 28, padding: '15px 28px', fontSize: 13 }}>
              {t('Phishing Detection & Mitigation')}
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 15px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontFamily: 'Barlow', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D71A28' }}>
            {t('Trusted by fraud fighters')}
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            background: '#fff',
            border: '1px solid #E3E7EB',
            borderRadius: 6,
            boxShadow: '0 16px 44px rgba(30,40,50,0.07)',
            padding: '56px 64px',
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 72, lineHeight: 0.5, color: '#D71A28', fontFamily: 'Barlow', fontWeight: 800, marginBottom: 8 }}>"</div>
          <blockquote style={{ fontFamily: 'Barlow', fontSize: 26, lineHeight: 1.4, fontWeight: 600, color: '#3E4753' }}>
            {current.quote}
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 34 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#3E4753' }}>{current.name}</div>
              <div style={{ fontSize: 14, color: '#7A8593', marginTop: 2 }}>{current.role}</div>
            </div>
            <div style={{ flex: 1, height: 1, background: '#E9EDF1' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={current.logo} alt="" style={{ maxHeight: 44, maxWidth: 150 }} />
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 28, right: 32, display: 'flex', gap: 12 }}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Previous testimonial"
              onClick={() => setTestimonial((s) => (s - 1 + testimonials.length) % testimonials.length)}
            >
              ❮
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Next testimonial"
              onClick={() => setTestimonial((s) => (s + 1) % testimonials.length)}
            >
              ❯
            </button>
          </div>
        </div>
      </section>

      {/* MAP / CFFC */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 15px' }}>
        <div style={{ height: 1, background: '#E9EDF1' }} />
      </div>
      <section style={{ position: 'relative', padding: '90px 15px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 56, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src="https://www.threatmark.com/wp-content/uploads/2025/01/Map-2024.webp" alt="Global coverage" style={{ width: '100%' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 40, lineHeight: 1.12, fontWeight: 700 }}>
              <span style={{ color: '#D71A28' }}>40+ million</span> {t('online users protected.')}
            </h2>
            <p style={{ fontSize: 17, color: '#5A6976', marginTop: 22, lineHeight: 1.7 }}>
              {t(
                "VeraWall's Cyber Fraud Fusion Center stands at the forefront of fighting cyber threats, such as phishing and malware, with its expertise, tools and intelligence.",
              )}
            </p>
            <a href="#" className="btn-primary" style={{ marginTop: 28, padding: '15px 28px', fontSize: 13 }} onClick={(e) => e.preventDefault()}>
              {t('Cyber Fraud Fusion Centre')}
            </a>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 15px' }}>
        <div style={{ height: 1, background: '#E9EDF1' }} />
      </div>
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '90px 15px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto 56px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 40, lineHeight: 1.15, fontWeight: 700 }}>{t('Revolutionizing fraud prevention.')}</h2>
          <p style={{ fontSize: 18, color: '#5A6976', marginTop: 22, lineHeight: 1.7 }}>
            {t(
              "The world's first full-stack fraud prevention platform built on behavior intelligence. It combines transaction risk analysis, threat detection and user behavior profiling in one integrated platform.",
            )}
          </p>
          <a href="#" className="btn-primary" style={{ marginTop: 28, padding: '15px 28px', fontSize: 13 }} onClick={(e) => e.preventDefault()}>
            {t('Learn More')}
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {features.map((f) => (
            <div key={f.n} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: '34px 28px' }}>
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
                  marginBottom: 20,
                }}
              >
                {f.n}
              </div>
              <h4 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{t(f.title)}</h4>
              <p style={{ fontSize: '14.5px', color: '#5A6976', marginTop: 12, lineHeight: 1.65 }}>{t(f.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSROOM */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 15px 100px' }}>
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
          {t('Newsroom')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <a href="#" className="news-card" onClick={(e) => e.preventDefault()}>
            <img src="https://www.threatmark.com/wp-content/uploads/2025/09/ScamFlag-Promo-1-548x200.png" alt="" style={{ width: '100%', display: 'block' }} />
            <div style={{ padding: '30px 32px' }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.35 }}>
                 Launches ScamFlag, a GenAI-Powered Solution to Combat the $486 Billion Digital Fraud Crisis
              </h4>
              <p style={{ fontSize: '14.5px', color: '#5A6976', marginTop: 12, lineHeight: 1.65 }}>
                A revolutionary Generative AI-powered solution designed to protect digital banks and their customers from the growing epidemic of scams.
              </p>
              <div className="btn-primary" style={{ display: 'inline-block', marginTop: 20, padding: '13px 24px', fontSize: 12 }}>
                {t('Read More')}
              </div>
            </div>
          </a>
          <a href="#" className="news-card" onClick={(e) => e.preventDefault()}>
            <img src="https://www.threatmark.com/wp-content/uploads/2025/01/Scams-Promo-S-548x200.webp" alt="" style={{ width: '100%', display: 'block' }} />
            <div style={{ padding: '30px 32px' }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.35 }}>Scam-Proofing The Future: A Whitepaper</h4>
              <p style={{ fontSize: '14.5px', color: '#5A6976', marginTop: 12, lineHeight: 1.65 }}>
                Scams are becoming more sophisticated, posing new challenges for financial institutions. An in-depth look at the evolving scam landscape and its real-world impacts.
              </p>
              <div className="btn-primary" style={{ display: 'inline-block', marginTop: 20, padding: '13px 24px', fontSize: 12 }}>
                {t('Download Now')}
              </div>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}
