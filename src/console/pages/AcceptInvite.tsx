import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import qrcode from 'qrcode-generator';
import { useAuth } from '../auth';
import { ApiError, consoleApi, displayRole } from '../api';
import { useApi } from '../useApi';
import { roleColors } from '../../data/console/settings';
import { Chip } from '../components/Chip';
import { AuthField, AuthShell, AuthSubmit } from '../components/AuthShell';

const backToLogin = (
  <Link
    to="/console/login"
    style={{ color: '#D71A28', fontWeight: 700, fontSize: '12.5px', textDecoration: 'none' }}
  >
    ← Go to sign-in
  </Link>
);

/** QR rendered as native JSX from the module matrix — no raw HTML. */
function QrSvg({ data }: { data: string }) {
  const qr = qrcode(0, 'M');
  qr.addData(data);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width="100%" height="100%" role="img"
         aria-label="QR code for authenticator enrollment" shapeRendering="crispEdges">
      <path d={d} fill="#1E262E" />
    </svg>
  );
}

function StepLabel({ step, title }: { step: number; title: string }) {
  return (
    <div
      style={{
        fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: '#7A8593', marginBottom: 6,
      }}
    >
      Step {step} of 2 · {title}
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <AuthShell>
      <h1 style={{ fontFamily: 'Barlow', fontSize: 20, fontWeight: 700, color: '#1E262E', margin: 0 }}>
        {title}
      </h1>
      <p style={{ fontSize: '13px', color: '#5A6976', lineHeight: 1.6, margin: '10px 0 18px' }}>
        {children}
      </p>
      {backToLogin}
    </AuthShell>
  );
}

export function AcceptInvite() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const { adoptSession } = useAuth();
  const navigate = useNavigate();

  const { data: invitation, error, loading } =
    useApi(() => consoleApi.invitationContext(token), [token]);

  const [step, setStep] = useState<'account' | 'mfa'>('account');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ name?: string; password?: string; confirm?: string }>({});
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [verifying, setVerifying] = useState(false);

  if (loading) return <AuthShell><div style={{ fontSize: 13, color: '#7A8593' }}>Loading invitation…</div></AuthShell>;

  if (error && error.status === 410) {
    return (
      <InfoCard title="Invitation expired">
        This invitation expired. Invitation links are valid for 7 days — ask your
        tenant admin to resend it from Platform Settings → Team &amp; Roles.
      </InfoCard>
    );
  }
  if (error || !invitation) {
    return (
      <InfoCard title="Invitation not found">
        This invitation link is invalid or has been revoked by an administrator.
        Ask your tenant admin to send a new invitation from Platform Settings → Team &amp; Roles.
      </InfoCard>
    );
  }

  const roleLabel = displayRole[invitation.role];

  const submitAccount = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Enter your full name.';
    if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (confirm !== password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setStep('mfa');
  };

  const submitCode = async (e: FormEvent) => {
    e.preventDefault();
    setCodeError('');
    setVerifying(true);
    try {
      const r = await consoleApi.acceptInvitation(token, {
        name: name.trim(), password, code,
      });
      adoptSession(r);
      navigate('/console/overview', { replace: true });
    } catch (err) {
      setVerifying(false);
      if (err instanceof ApiError && /code/i.test(err.body.error || '')) {
        setCodeError('Code didn’t match. Codes rotate every 30 seconds — enter the current one.');
      } else {
        setCodeError(err instanceof ApiError ? (err.body.error || 'Activation failed.') : 'Cannot reach the platform API.');
      }
    }
  };

  if (step === 'mfa') {
    const groupedSecret = invitation.secret.replace(/(.{4})/g, '$1 ').trim();
    return (
      <AuthShell footer={<>Sessions are protected by VeraWall behavioral monitoring.</>}>
        <StepLabel step={2} title="Two-factor authentication" />
        <h1 style={{ fontFamily: 'Barlow', fontSize: 20, fontWeight: 700, color: '#1E262E', margin: 0 }}>
          Secure your account
        </h1>
        <div style={{ fontSize: '12.5px', color: '#7A8593', marginTop: 4 }}>
          Two-factor authentication is required for analyst access.
        </div>

        <div
          style={{
            display: 'flex', gap: 16, alignItems: 'flex-start',
            background: '#F7F8FA', border: '1px solid #E3E7EB', borderRadius: 3,
            padding: 14, margin: '16px 0',
          }}
        >
          <div
            style={{
              width: 132, height: 132, flexShrink: 0, background: '#fff',
              border: '1px solid #E3E7EB', borderRadius: 3, padding: 8, boxSizing: 'border-box',
            }}
          >
            <QrSvg data={invitation.otpauthUri} />
          </div>
          <div style={{ fontSize: '12px', color: '#5A6976', lineHeight: 1.55 }}>
            <div style={{ fontWeight: 700, color: '#1E262E', marginBottom: 4 }}>
              1 · Scan with your authenticator app
            </div>
            Google Authenticator, Microsoft Authenticator or any TOTP app.
            <div style={{ fontWeight: 700, color: '#1E262E', margin: '10px 0 4px' }}>
              Can&apos;t scan? Enter the key manually:
            </div>
            <code style={{ fontSize: '11.5px', color: '#1E262E', overflowWrap: 'anywhere' }}>
              {groupedSecret}
            </code>
          </div>
        </div>

        <form onSubmit={submitCode} noValidate>
          <AuthField
            label="2 · Enter the 6-digit code"
            value={code}
            onChange={(v) => { setCode(v.replace(/[^\d]/g, '')); setCodeError(''); }}
            placeholder="000000"
            autoFocus
            autoComplete="one-time-code"
            maxLength={6}
            inputMode="numeric"
            centered
            error={codeError}
          />
          <div style={{ marginTop: 16 }}>
            <AuthSubmit busy={verifying}>
              {verifying ? 'Verifying…' : 'Verify & enter the console'}
            </AuthSubmit>
          </div>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={<>Sessions are protected by VeraWall behavioral monitoring.</>}>
      <StepLabel step={1} title="Account" />
      <h1 style={{ fontFamily: 'Barlow', fontSize: 20, fontWeight: 700, color: '#1E262E', margin: 0 }}>
        You&apos;re invited to the BIP Console
      </h1>
      <div style={{ fontSize: '12.5px', color: '#7A8593', marginTop: 4 }}>
        Invited by {invitation.invitedBy} · Demo Bank tenant
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          background: '#F7F8FA', border: '1px solid #E3E7EB', borderRadius: 3,
          padding: '10px 13px', margin: '14px 0 18px',
        }}
      >
        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E262E', overflowWrap: 'anywhere' }}>
          {invitation.email}
        </span>
        <Chip color={roleColors[roleLabel]}>{roleLabel}</Chip>
      </div>

      <form onSubmit={submitAccount} noValidate>
        <AuthField
          label="Full name"
          value={name}
          onChange={(v) => { setName(v); setErrors((c) => ({ ...c, name: undefined })); }}
          placeholder="A. Analyst"
          autoComplete="name"
          autoFocus
          error={errors.name}
        />
        <AuthField
          label="Choose a password"
          type="password"
          value={password}
          onChange={(v) => { setPassword(v); setErrors((c) => ({ ...c, password: undefined })); }}
          placeholder="8+ characters"
          autoComplete="new-password"
          error={errors.password}
        />
        <AuthField
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={(v) => { setConfirm(v); setErrors((c) => ({ ...c, confirm: undefined })); }}
          placeholder="Repeat password"
          autoComplete="new-password"
          error={errors.confirm}
        />
        <div style={{ marginTop: 18 }}>
          <AuthSubmit>Continue to two-factor setup</AuthSubmit>
        </div>
      </form>
    </AuthShell>
  );
}
