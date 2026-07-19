import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

// Shared shell for the console's signed-out screens (login, invitation).
// Dark backdrop matches the sidebar identity; the white card uses the
// console's standard vocabulary (radius 6 card, radius 3 controls).

export function AuthShell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1D1D1B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
        fontFamily: 'Open Sans, sans-serif',
        color: '#3E4753',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
        <svg width="34" height="34" viewBox="0 0 28 28" aria-hidden="true">
          <path d="M14 1 L26 5.5 V13 C26 20.5 21 25.5 14 27.5 C7 25.5 2 20.5 2 13 V5.5 Z" fill="#D71A28" />
          <path d="M8.5 9.5 L14 19.5 L19.5 9.5" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 26, letterSpacing: '0.01em', color: '#FFFFFF' }}>
          VeraWall
        </span>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          border: '1px solid #E3E7EB',
          borderRadius: 6,
          padding: '26px 26px 24px',
        }}
      >
        {children}
      </div>

      {footer && (
        <div style={{ marginTop: 20, maxWidth: 400, textAlign: 'center', fontSize: '11.5px', lineHeight: 1.6, color: '#9DA2A7' }}>
          {footer}
        </div>
      )}
    </div>
  );
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: 'Barlow',
  fontSize: '10.5px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#5A6976',
  marginBottom: 6,
};

export function AuthField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoFocus,
  autoComplete,
  error,
  maxLength,
  inputMode,
  centered,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  error?: string;
  maxLength?: number;
  inputMode?: 'numeric' | 'text';
  centered?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const id = 'fld-' + label.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={!!error}
        maxLength={maxLength}
        inputMode={inputMode}
        style={{
          width: '100%',
          padding: '11px 13px',
          fontSize: centered ? '18px' : '13.5px',
          letterSpacing: centered ? '0.35em' : undefined,
          textAlign: centered ? 'center' : undefined,
          fontFamily: centered ? 'monospace' : 'Open Sans, sans-serif',
          color: '#1E262E',
          background: '#fff',
          border: `1px solid ${error ? '#D71A28' : focused ? '#1E262E' : '#E3E7EB'}`,
          borderRadius: 3,
          outline: 'none',
          transition: 'border-color .15s',
          boxSizing: 'border-box',
        }}
      />
      {error && (
        <div style={{ marginTop: 5, fontSize: '11.5px', fontWeight: 600, color: '#D71A28' }}>{error}</div>
      )}
    </div>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      style={{
        background: '#FBF1F2',
        border: '1px solid #F2D9DB',
        borderRadius: 3,
        padding: '10px 13px',
        fontSize: '12.5px',
        fontWeight: 600,
        color: '#D71A28',
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

export function AuthSubmit({ children, busy }: { children: ReactNode; busy?: boolean }) {
  return (
    <button
      type="submit"
      disabled={busy}
      style={{
        width: '100%',
        padding: '13px 24px',
        background: busy ? '#B8121F' : '#D71A28',
        color: '#fff',
        border: 'none',
        borderRadius: 3,
        fontFamily: 'Barlow',
        fontSize: '11.5px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: busy ? 'default' : 'pointer',
        opacity: busy ? 0.85 : 1,
        transition: 'background .15s',
      }}
    >
      {children}
    </button>
  );
}
