import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
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
import { FraudIntel } from './console/pages/FraudIntel';

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
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/solutions/:slug" element={<SolutionDetail />} />
            <Route path="/instant-payment-scams" element={<InstantPaymentScams />} />
          </Route>
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
            <Route path="fraud-intel" element={<FraudIntel />} />
          </Route>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
