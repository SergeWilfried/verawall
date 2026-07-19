import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  ApiError, clearToken, consoleApi, displayRole, getToken, roleRank,
  setToken, setUnauthorizedHandler,
} from './api';
import type { DisplayRole, LoginResponse, ServerRole } from './api';

// Session against the Go console API: opaque bearer token (12h TTL,
// revocable server-side) + the analyst identity from /me. The token is
// the only thing persisted; identity is re-validated on boot.

export type AnalystRole = DisplayRole;

export interface ConsoleSession {
  token: string;
  name: string;
  email: string;
  role: DisplayRole;
  serverRole: ServerRole;
  rank: number;
  mfaEnrolled: boolean;
}

export type SignInResult =
  | { ok: true }
  | { ok: false; mfaRequired: boolean; error: string };

interface AuthValue {
  session: ConsoleSession | null;
  /** True while a stored token is being validated against /me on boot. */
  checking: boolean;
  signIn: (email: string, password: string, code?: string) => Promise<SignInResult>;
  adoptSession: (r: LoginResponse) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function sessionFrom(token: string, a: { email: string; name?: string;
  role: ServerRole | 'service'; mfaEnrolled: boolean }): ConsoleSession {
  const sr: ServerRole = a.role === 'service' ? 'senior' : a.role;
  return {
    token,
    name: a.name || a.email,
    email: a.email,
    role: displayRole[sr],
    serverRole: sr,
    rank: roleRank[sr],
    mfaEnrolled: a.mfaEnrolled,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ConsoleSession | null>(null);
  const [checking, setChecking] = useState<boolean>(() => !!getToken());

  const dropSession = useCallback(() => {
    clearToken();
    setSession(null);
  }, []);

  // Expired/revoked token anywhere in the app tears the session down;
  // RequireAuth then redirects to the login screen.
  useEffect(() => {
    setUnauthorizedHandler(dropSession);
    return () => setUnauthorizedHandler(null);
  }, [dropSession]);

  // Boot: validate the persisted token.
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    let cancelled = false;
    consoleApi.me()
      .then((me) => { if (!cancelled) setSession(sessionFrom(token, me)); })
      .catch(() => { if (!cancelled) dropSession(); })
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, [dropSession]);

  const adoptSession = useCallback((r: LoginResponse) => {
    setToken(r.token);
    setSession(sessionFrom(r.token, r.analyst));
    setChecking(false);
  }, []);

  const signIn = useCallback<AuthValue['signIn']>(async (email, password, code) => {
    try {
      const r = await consoleApi.login(email.trim(), password, code);
      adoptSession(r);
      return { ok: true };
    } catch (e) {
      if (e instanceof ApiError) {
        return {
          ok: false,
          mfaRequired: !!e.body.mfaRequired,
          error: e.body.mfaRequired && !code
            ? 'Enter the 6-digit code from your authenticator app.'
            : e.body.error || 'Sign-in failed.',
        };
      }
      return { ok: false, mfaRequired: false, error: 'Cannot reach the platform API.' };
    }
  }, [adoptSession]);

  const signOut = useCallback(() => {
    consoleApi.logout().catch(() => {});
    dropSession();
  }, [dropSession]);

  const value = useMemo(
    () => ({ session, checking, signIn, adoptSession, signOut }),
    [session, checking, signIn, adoptSession, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, checking } = useAuth();
  const location = useLocation();
  if (checking) return null;   // brief blank while /me validates the stored token
  if (!session) {
    return <Navigate to="/console/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
