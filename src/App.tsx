import { useEffect, useRef } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from './i18n/LanguageContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToHash } from './components/ScrollToHash';
import { Home } from './pages/Home';
import { SolutionDetail } from './pages/SolutionDetail';
import { InstantPaymentScams } from './pages/InstantPaymentScams';
import { ConsoleLayout } from './console/ConsoleLayout';
import { AuthProvider, RequireAuth } from './console/auth';
import { ConsoleLogin } from './console/pages/ConsoleLogin';
import { AcceptInvite } from './console/pages/AcceptInvite';
import { Overview } from './console/pages/Overview';
import { AlertQueue } from './console/pages/AlertQueue';
import { AlertReview } from './console/pages/AlertReview';
import { CustomerProfile } from './console/pages/CustomerProfile';
import { Detections } from './console/pages/Detections';
import { TransactionRisk } from './console/pages/TransactionRisk';
import { CaseManagement } from './console/pages/CaseManagement';
import { TransactionGraph } from './console/pages/TransactionGraph';
import { PlatformSettings } from './console/pages/PlatformSettings';
import { PayeeIntel } from './console/pages/PayeeIntel';

// Pins the context language to the route tree: /fr/* renders French, the
// unprefixed tree renders English. The URL is what crawlers index, so it —
// not storage — decides what a given address serves.
function LangSync({ lang }: { lang: 'en' | 'fr' }) {
  const { lang: current, setLang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const checkedPreference = useRef(false);

  // First load on an unprefixed URL: honor a stored/browser French
  // preference once, with a same-URL replace. Crawlers carry neither, so
  // they always see English at unprefixed addresses.
  useEffect(() => {
    if (lang === 'en' && !checkedPreference.current) {
      let pref: string | null = null;
      try {
        pref = localStorage.getItem('vw_lang');
        if (!pref && /^fr\b/i.test(navigator.language)) pref = 'fr';
      } catch { /* storage unavailable */ }
      if (pref === 'fr') {
        navigate('/fr' + (location.pathname === '/' ? '' : location.pathname) + location.hash, { replace: true });
      }
    }
    checkedPreference.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (current !== lang) setLang(lang);
  }, [lang, current, setLang]);

  return <Outlet />;
}

function MarketingLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', overflowX: 'hidden' }}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToHash />
        <AuthProvider>
        <Routes>
          {(['en', 'fr'] as const).map((lng) => (
            <Route key={lng} path={lng === 'fr' ? '/fr' : '/'} element={<LangSync lang={lng} />}>
              <Route element={<MarketingLayout />}>
                <Route index element={<Home />} />
                <Route path="solutions/:slug" element={<SolutionDetail />} />
                <Route path="instant-payment-scams" element={<InstantPaymentScams />} />
              </Route>
            </Route>
          ))}
          <Route path="/console/login" element={<ConsoleLogin />} />
          <Route path="/console/invite" element={<AcceptInvite />} />
          <Route path="/console" element={<RequireAuth><ConsoleLayout /></RequireAuth>}>
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="alerts" element={<AlertQueue />} />
            <Route path="alerts/:alertId" element={<AlertReview />} />
            <Route path="customers/:name" element={<CustomerProfile />} />
            <Route path="detections" element={<Detections />} />
            <Route path="transaction-risk" element={<TransactionRisk />} />
            <Route path="cases" element={<CaseManagement />} />
            <Route path="graph" element={<TransactionGraph />} />
            <Route path="settings" element={<PlatformSettings />} />
            <Route path="payee-intel" element={<PayeeIntel />} />
          </Route>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
