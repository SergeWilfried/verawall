// Console API client for the Go ingest server. Single place for the base
// URL, bearer token, error shape, and the server↔display role mapping.
// Server payloads keep their snake_case field names on purpose — the
// types below are the wire contract, presenters adapt in the pages.

export const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8080';

// ---------- roles ----------

export type ServerRole = 'readonly' | 'analyst' | 'senior' | 'admin';
export type DisplayRole = 'Admin' | 'Senior analyst' | 'Analyst' | 'Read-only';

export const displayRole: Record<ServerRole, DisplayRole> = {
  admin: 'Admin', senior: 'Senior analyst', analyst: 'Analyst', readonly: 'Read-only',
};
export const serverRole: Record<DisplayRole, ServerRole> = {
  Admin: 'admin', 'Senior analyst': 'senior', Analyst: 'analyst', 'Read-only': 'readonly',
};
export const roleRank: Record<ServerRole, number> = {
  readonly: 0, analyst: 1, senior: 2, admin: 3,
};

// ---------- token & transport ----------

const TOKEN_KEY = 'vw_console_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  status: number;
  body: { error?: string; mfaRequired?: boolean } & Record<string, unknown>;
  constructor(status: number, body: ApiError['body']) {
    super(body.error || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

let onUnauthorized: (() => void) | null = null;
/** AuthProvider registers session teardown for expired/revoked tokens. */
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

interface ApiOpts {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** false for public endpoints (login, invitation context/accept). */
  auth?: boolean;
}

export async function api<T>(path: string, opts: ApiOpts = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (opts.auth !== false && token) headers.Authorization = `Bearer ${token}`;
  let res: Response;
  try {
    res = await fetch(API_BASE + path, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError(0, { error: `Cannot reach the platform API at ${API_BASE}.` });
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && opts.auth !== false && onUnauthorized) onUnauthorized();
    throw new ApiError(res.status, body);
  }
  return body as T;
}

// ---------- wire types ----------

export interface ServerAnalyst {
  email: string;
  name: string;
  role: ServerRole;
  mfaEnrolled: boolean;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  analyst: ServerAnalyst;
}

export interface MeResponse {
  email: string;
  name?: string;
  role: ServerRole | 'service';
  rank: number;
  mfaEnrolled: boolean;
}

export interface ServerSignal {
  code: string;
  label: string;
  weight: number;
  evidence: string;
}

export interface ServerAlert {
  id: string;
  session_id: string | null;
  account_ref: string | null;
  user_ref: string | null;
  score: number;
  threat_type: string | null;
  signal: string;
  state: 'Open' | 'Contained' | 'Resolved';
  txn: Record<string, unknown> | null;
  disposition: string | null;
  case_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServerEvent {
  type: string;
  ts: string;
  install_id?: string | null;
  user_ref?: string | null;
  call_signals: { inGsmCall?: boolean; inVoipCall?: boolean; speakerOn?: boolean } | null;
  payload: Record<string, unknown> | null;
}

export interface ServerAction {
  id: string;
  kind: string;
  target: Record<string, unknown>;
  note: string | null;
  webhook_status: string;
  device_status: string;
  created_at: string;
}

export interface ServerBankTxn {
  txn_ref: string;
  direction: 'IN' | 'OUT';
  amount: number;
  currency: string | null;
  counterparty_ref: string | null;
  channel: string | null;
  ts: string;
}

export interface AlertDetail extends ServerAlert {
  signals: ServerSignal[];
  timeline: ServerEvent[];
  install_id: string | null;
  device: { install_id: string; first_seen: string; last_seen: string;
            fingerprint: Record<string, unknown> | null } | null;
  priorAlerts: Pick<ServerAlert, 'id' | 'score' | 'state' | 'signal' | 'created_at'>[];
  bankTxns: ServerBankTxn[];
  actions: ServerAction[];
}

export interface ServerCase {
  id: string;
  user_ref: string | null;
  threat_type: string | null;
  status: 'Investigating' | 'Escalated' | 'Pending' | 'Closed';
  assignee: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface CaseDetail extends ServerCase {
  timeline: { event: string; at: string }[];
  alerts: Pick<ServerAlert, 'id' | 'score' | 'state' | 'signal'>[];
}

export interface OverviewStats {
  openAlerts: number;
  sessionsLast24h: number;
  decisionsLast30d: { held: number; step_up: number; total: number };
  knownUsers: number;
}

export interface DetectionCount {
  threat_type: string;
  count: number;
  open: number;
}

export interface DecisionRow {
  session_id: string | null;
  user_ref: string | null;
  txn_ref: string | null;
  txn: Record<string, unknown> | null;
  decision: 'ALLOW' | 'STEP_UP' | 'HOLD';
  score: number;
  created_at: string;
}

export interface TransactionRisk {
  stream: DecisionRow[];
  mix: { allow: number; step_up: number; hold: number; total: number };
}

export interface ActivityItem {
  kind: 'alert' | 'action' | 'case';
  id: string;
  detail: string;
  threat_type: string | null;
  at: string;
}

export interface TeamMember {
  id: number;
  email: string;
  name: string;
  role: ServerRole;
  disabled: boolean;
  mfa_enrolled: boolean;
  created_at: string;
}

export interface ServerInvitation {
  token: string;
  email: string;
  role: ServerRole;
  invited_by: string;
  created_at: string;
  expires_at: string;
  expired: boolean;
}

export interface InvitationContext {
  email: string;
  role: ServerRole;
  invitedBy: string;
  expiresAt: string;
  secret: string;
  otpauthUri: string;
}

export interface UserProfile {
  user_ref: string;
  first_seen: string;
  last_seen: string;
  session_count: number;
  devices: { install_id: string; first_seen: string; last_seen: string;
             session_count: number; fingerprint: Record<string, unknown> | null }[];
  alerts: Pick<ServerAlert, 'id' | 'score' | 'state' | 'signal' | 'created_at'>[];
  recentSessions: { session_id: string; started_at: string; last_event_at: string;
                    event_count: number; sim_changed: boolean }[];
}

// ---------- endpoint helpers ----------

export const consoleApi = {
  login: (email: string, password: string, code?: string) =>
    api<LoginResponse>('/v1/console/login',
      { method: 'POST', body: { email, password, code }, auth: false }),
  me: () => api<MeResponse>('/v1/console/me'),
  logout: () => api<{ ok: boolean }>('/v1/console/logout', { method: 'POST' }),

  overview: () => api<OverviewStats>('/v1/console/overview'),
  alerts: (state?: string) =>
    api<ServerAlert[]>(`/v1/console/alerts${state ? `?state=${encodeURIComponent(state)}` : ''}`),
  alert: (id: string) => api<AlertDetail>(`/v1/console/alerts/${id}`),
  patchAlert: (id: string, body: { state?: string; disposition?: string }) =>
    api<ServerAlert>(`/v1/console/alerts/${id}`, { method: 'PATCH', body }),
  postAction: (id: string, kind: string, note?: string) =>
    api<ServerAction>(`/v1/console/alerts/${id}/actions`, { method: 'POST', body: { kind, note } }),
  openCase: (id: string, body: { assignee?: string; summary?: string }) =>
    api<{ caseId: string }>(`/v1/console/alerts/${id}/case`, { method: 'POST', body }),

  cases: (status?: string) =>
    api<ServerCase[]>(`/v1/console/cases${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  caseDetail: (id: string) => api<CaseDetail>(`/v1/console/cases/${id}`),
  patchCase: (id: string, body: { status?: string; assignee?: string; note?: string }) =>
    api<ServerCase>(`/v1/console/cases/${id}`, { method: 'PATCH', body }),

  user: (ref: string) => api<UserProfile>(`/v1/console/users/${ref}`),
  detections: (days = 30) => api<DetectionCount[]>(`/v1/console/detections?days=${days}`),
  transactionRisk: () => api<TransactionRisk>('/v1/console/transaction-risk'),
  activity: (limit = 8) => api<ActivityItem[]>(`/v1/console/activity?limit=${limit}`),

  team: () => api<TeamMember[]>('/v1/console/team'),
  invitations: () => api<ServerInvitation[]>('/v1/console/team/invitations'),
  invite: (email: string, role: ServerRole) =>
    api<ServerInvitation>('/v1/console/team/invitations', { method: 'POST', body: { email, role } }),
  revokeInvitation: (token: string) =>
    api<{ ok: boolean }>(`/v1/console/team/invitations/${token}`, { method: 'DELETE' }),
  resendInvitation: (token: string) =>
    api<ServerInvitation>(`/v1/console/team/invitations/${token}/resend`, { method: 'POST' }),

  invitationContext: (token: string) =>
    api<InvitationContext>(`/v1/console/invitations/${token}`, { auth: false }),
  acceptInvitation: (token: string, body: { name: string; password: string; code: string }) =>
    api<LoginResponse>(`/v1/console/invitations/${token}/accept`,
      { method: 'POST', body, auth: false }),
};

// ---------- small shared formatters ----------

export function expiryLabel(expiresAt: string): string {
  const delta = new Date(expiresAt).getTime() - Date.now();
  const days = Math.ceil(Math.abs(delta) / 86_400_000);
  if (delta > 0) return days <= 1 ? 'expires today' : `expires in ${days} days`;
  return days <= 1 ? 'expired today' : `expired ${days} days ago`;
}

export function shortRef(ref: string | null | undefined, n = 8): string {
  if (!ref) return '—';
  return ref.length > n ? ref.slice(0, n) + '…' : ref;
}
