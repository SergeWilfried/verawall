import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth';
import { AuthError, AuthField, AuthShell, AuthSubmit } from '../components/AuthShell';
import { LanguageSwitch } from '../components/LanguageSwitch';

export function ConsoleLogin() {
  const { t } = useTranslation();
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/console/overview';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [mfaStep, setMfaStep] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to={from} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError(t('login.errorEmailRequired'));
      return;
    }
    setBusy(true);
    const r = await signIn(email, password, mfaStep ? code : undefined);
    if (r.ok) {
      navigate(from, { replace: true });
      return;
    }
    setBusy(false);
    if (r.mfaRequired && !mfaStep) {
      setMfaStep(true);       // account has 2FA — ask for the code
      return;
    }
    setError(r.error);
  };

  return (
    <AuthShell
      footer={
        <>
          {t('login.footerBootstrap')}&nbsp;
          <button
            type="button"
            onClick={() => { setEmail('admin@demobank.cz'); setPassword('admin-dev-password'); setError(''); }}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: '#EAEAEA', fontSize: '11.5px', fontWeight: 700, textDecoration: 'underline',
            }}
          >
            admin@demobank.cz / admin-dev-password
          </button>
          <div style={{ marginTop: 10 }}>{t('login.footerMonitoring')}</div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
            <LanguageSwitch variant="dark" />
          </div>
        </>
      }
    >
      <h1 style={{ fontFamily: 'Barlow', fontSize: 20, fontWeight: 700, color: '#1E262E', margin: 0 }}>
        {mfaStep ? t('login.titleMfa') : t('login.titleSignin')}
      </h1>
      <div style={{ fontSize: '12.5px', color: '#7A8593', marginTop: 4, marginBottom: 18 }}>
        {mfaStep
          ? <>{t('login.mfaSubject')} <strong>{email.trim()}</strong> — {t('login.mfaHint')}</>
          : t('login.subtitleDefault')}
      </div>

      <form onSubmit={submit} noValidate>
        {error && <AuthError>{error}</AuthError>}
        {!mfaStep && (
          <>
            <AuthField
              label={t('login.fieldEmail')}
              type="email"
              value={email}
              onChange={(v) => { setEmail(v); setError(''); }}
              placeholder="name@demobank.cz"
              autoComplete="username"
              autoFocus
            />
            <AuthField
              label={t('login.fieldPassword')}
              type="password"
              value={password}
              onChange={(v) => { setPassword(v); setError(''); }}
              placeholder="••••••••••"
              autoComplete="current-password"
            />
          </>
        )}
        {mfaStep && (
          <AuthField
            label={t('login.fieldCode')}
            value={code}
            onChange={(v) => { setCode(v.replace(/[^\d]/g, '')); setError(''); }}
            placeholder="000000"
            autoFocus
            autoComplete="one-time-code"
            maxLength={6}
            inputMode="numeric"
            centered
          />
        )}
        <div style={{ marginTop: 18 }}>
          <AuthSubmit busy={busy}>
            {busy ? t('login.submitSigningIn') : mfaStep ? t('login.submitVerify') : t('login.submitSignin')}
          </AuthSubmit>
        </div>
        {mfaStep && (
          <button
            type="button"
            onClick={() => { setMfaStep(false); setCode(''); setError(''); }}
            style={{
              marginTop: 12, background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: '#7A8593', fontSize: '12px', fontWeight: 600,
            }}
          >
            {t('login.differentAccount')}
          </button>
        )}
      </form>

      {!mfaStep && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #EEF1F4', fontSize: '11.5px', color: '#7A8593' }}>
          {t('login.ssoNote')}
        </div>
      )}
    </AuthShell>
  );
}
