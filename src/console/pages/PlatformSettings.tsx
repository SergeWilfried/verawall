import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useConsoleTitle } from '../TitleContext';
import { Skeleton, SkeletonLines } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { KeyArt } from '../components/emptyArt';
import { roleColors } from '../../data/console/settings';
import { Chip } from '../components/Chip';
import { Toggle } from '../components/Toggle';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../usePagination';
import { useAuth } from '../auth';
import { consoleApi, displayRole, expiryLabel, serverRole } from '../api';
import type { ApiKey, ServerInvitation, ServerRole, TeamMember, TenantSettings } from '../api';
import { useApi } from '../useApi';

function initialsOf(name: string) {
  return name.split(' ').map((w) => w[0]).join('').replace('.', '');
}

const ghostBtn: CSSProperties = {
  padding: '6px 10px', background: 'none', border: 'none', borderRadius: 3, cursor: 'pointer',
  fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em',
  textTransform: 'uppercase', color: '#5A6976', whiteSpace: 'nowrap',
};

type DisplayRoleName = 'Admin' | 'Senior analyst' | 'Analyst' | 'Read-only';
const inviteRoles: DisplayRoleName[] = ['Admin', 'Senior analyst', 'Analyst', 'Read-only'];
const TEAM_PAGE_SIZE = 6;

function TeamSection() {
  const { session } = useAuth();
  const isAdmin = session?.role === 'Admin';

  const team = useApi<TeamMember[]>(() => consoleApi.team(), []);
  const invitesQuery = useApi<ServerInvitation[]>(() => consoleApi.invitations(), []);
  const invites = invitesQuery.data ?? [];

  const members = useMemo(() => team.data ?? [], [team.data]);
  const { pageItems: memberPage, page, setPage, totalPages, totalItems } =
    usePagination(members, TEAM_PAGE_SIZE);

  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<DisplayRoleName>('Analyst');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [copiedToken, setCopiedToken] = useState('');

  const refresh = () => { team.reload(); invitesQuery.reload(); };

  const sendInvite = async () => {
    const addr = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
      setFormError('Enter a valid email address.');
      return;
    }
    try {
      const inv = await consoleApi.invite(addr, serverRole[role]);
      setEmail(''); setRole('Analyst'); setFormOpen(false); setFormError('');
      setNotice(`✓ Invitation sent to ${inv.email} — the link is valid for 7 days.`);
      invitesQuery.reload();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not send the invitation.');
    }
  };

  const inviteLink = (inv: ServerInvitation) =>
    `${window.location.origin}/console/invite?token=${inv.token}`;

  const copyLink = (inv: ServerInvitation) => {
    navigator.clipboard?.writeText(inviteLink(inv)).catch(() => {});
    setCopiedToken(inv.token);
    window.setTimeout(() => setCopiedToken(''), 1800);
  };

  const resend = async (inv: ServerInvitation) => {
    await consoleApi.resendInvitation(inv.token).catch(() => {});
    setNotice(`✓ Invitation to ${inv.email} resent — expiry reset to 7 days.`);
    invitesQuery.reload();
  };

  const revoke = async (inv: ServerInvitation) => {
    await consoleApi.revokeInvitation(inv.token).catch(() => {});
    setNotice(`Invitation to ${inv.email} revoked — the link no longer works.`);
    invitesQuery.reload();
  };

  const inputStyle: CSSProperties = {
    padding: '10px 12px', fontSize: 13, fontFamily: 'Open Sans, sans-serif', color: '#1E262E',
    border: '1px solid #E3E7EB', borderRadius: 3, outline: 'none', background: '#fff',
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Team &amp; roles</div>
          <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>
            {isAdmin
              ? 'Invite analysts by email — they set their password and two-factor authentication from the invitation link.'
              : 'Only tenant admins can invite analysts or change roles.'}
          </div>
        </div>
        <button
          type="button"
          disabled={!isAdmin}
          onClick={() => { setFormOpen((o) => !o); setFormError(''); setNotice(''); }}
          style={{
            marginLeft: 'auto', padding: '8px 14px', borderRadius: 3, cursor: isAdmin ? 'pointer' : 'default',
            fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            background: '#fff', color: isAdmin ? '#D71A28' : '#9DA2A7',
            border: `1px solid ${isAdmin ? '#D71A28' : '#E3E7EB'}`,
          }}
        >
          {formOpen ? 'Cancel' : 'Invite analyst'}
        </button>
      </div>

      {formOpen && (
        <div style={{ marginTop: 14, padding: 14, background: '#F7F8FA', border: '1px solid #E3E7EB', borderRadius: 3 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="email"
              value={email}
              placeholder="analyst@demobank.cz"
              autoFocus
              onChange={(e) => { setEmail(e.target.value); setFormError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') sendInvite(); }}
              aria-label="Invitee email"
              style={{ ...inputStyle, flex: '1 1 220px', borderColor: formError ? '#D71A28' : '#E3E7EB' }}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as DisplayRoleName)}
              aria-label="Invitee role"
              style={{ ...inputStyle, flex: '0 0 auto', fontWeight: 600, cursor: 'pointer' }}
            >
              {inviteRoles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
              type="button"
              onClick={sendInvite}
              style={{
                padding: '10px 18px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3,
                fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Send invitation
            </button>
          </div>
          {formError && (
            <div style={{ marginTop: 8, fontSize: '11.5px', fontWeight: 700, color: '#D71A28' }}>{formError}</div>
          )}
        </div>
      )}

      {notice && (
        <div style={{ marginTop: 12, fontSize: '12.5px', fontWeight: 700, color: notice.startsWith('✓') ? '#2FBF71' : '#5A6976' }}>
          {notice}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
        {team.loading && !team.data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '6px 0' }}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F0F2F5' }}>
                <Skeleton w={34} h={34} r={17} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <Skeleton w={`${30 + ((i * 17) % 20)}%`} h={12} />
                  <Skeleton w={`${45 + ((i * 11) % 25)}%`} h={10} />
                </div>
                <Skeleton w={80} h={22} r={11} />
              </div>
            ))}
          </div>
        )}
        {team.error && (
          <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#D71A28', padding: '12px 0' }}>
            {team.error.message}
          </div>
        )}
        {memberPage.map((tm) => {
          const label = displayRole[tm.role as ServerRole] ?? tm.role;
          return (
            <div key={tm.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F2F5' }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: tm.role === 'admin' ? '#D71A28' : '#1D1D1B',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow',
                  fontWeight: 700, fontSize: 11, flexShrink: 0,
                }}
              >
                {initialsOf(tm.name || tm.email)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  {tm.name || tm.email}
                  {session?.email === tm.email && (
                    <span style={{ fontWeight: 600, color: '#7A8593' }}> (you)</span>
                  )}
                </div>
                <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2 }}>{tm.email}</div>
              </div>
              {tm.mfa_enrolled && <Chip color="#2FBF71">2FA</Chip>}
              <Chip color={roleColors[label]}>{label}</Chip>
            </div>
          );
        })}
      </div>
      {totalItems > TEAM_PAGE_SIZE && (
        <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={TEAM_PAGE_SIZE} onChange={setPage} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
        <div style={{ fontFamily: 'Barlow', fontSize: 13, fontWeight: 700 }}>
          Pending invitations
          {invites.length > 0 && (
            <span style={{ fontWeight: 600, color: '#7A8593' }}> · {invites.length}</span>
          )}
        </div>
        <button
          type="button"
          onClick={refresh}
          style={{ ...ghostBtn, marginLeft: 'auto', color: '#7A8593' }}
        >
          Refresh
        </button>
      </div>
      {invites.length === 0 ? (
        <div style={{ fontSize: '12.5px', color: '#7A8593', padding: '12px 0' }}>
          No pending invitations. {isAdmin ? 'Use “Invite analyst” to add a teammate.' : ''}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 4 }}>
          {invites.map((inv) => {
            const label = displayRole[inv.role as ServerRole] ?? inv.role;
            return (
              <div key={inv.token} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F2F5', flexWrap: 'wrap' }}>
                <span
                  style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: inv.expired ? '#E67E22' : '#2C7BB6',
                  }}
                />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, overflowWrap: 'anywhere' }}>{inv.email}</div>
                  <div style={{ fontSize: '11.5px', color: inv.expired ? '#E67E22' : '#7A8593', marginTop: 2 }}>
                    Invited by {inv.invited_by} · {expiryLabel(inv.expires_at)}
                  </div>
                </div>
                <Chip color={roleColors[label]}>{label}</Chip>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button type="button" style={ghostBtn} onClick={() => copyLink(inv)}>
                      {copiedToken === inv.token ? '✓ Copied' : 'Copy link'}
                    </button>
                    <button type="button" style={ghostBtn} onClick={() => resend(inv)}>
                      Resend
                    </button>
                    <button type="button" style={{ ...ghostBtn, color: '#D71A28' }} onClick={() => revoke(inv)}>
                      Revoke
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const sections = [
  { key: 'general', label: 'General' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'keys', label: 'API Keys' },
  { key: 'modules', label: 'Modules' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'team', label: 'Team & Roles' },
] as const;

type SectionKey = (typeof sections)[number]['key'];

const notifLabels: Record<string, { name: string; desc: string }> = {
  digest: { name: 'Daily e-mail digest', desc: 'Queue summary at 07:00 to the fraud-ops list' },
  webhook: { name: 'Teams webhook', desc: 'New critical alerts posted to #fraud-ops' },
  sms: { name: 'SMS on critical', desc: 'Score ≥ 90 pages the on-call analyst' },
  weekly: { name: 'Weekly report', desc: 'Reporting summary mailed every Friday 17:00' },
};
const moduleLabels: Record<string, { name: string; desc: string }> = {
  bip: { name: 'Behavioral Intelligence', desc: 'Session profiling & anomaly detection' },
  scamflag: { name: 'ScamFlag', desc: 'GenAI scam analysis of customer submissions' },
  insights: { name: 'Smart Insights', desc: 'False-positive tuning & model feedback' },
  fraudintel: { name: 'FraudIntel sharing', desc: 'Contribute & consume network intelligence' },
  cffc: { name: 'CFFC monitoring', desc: '24/7 Fusion Center escalation channel' },
};
const tenantFields: { key: keyof TenantSettings['tenant']; label: string; editable: boolean }[] = [
  { key: 'name', label: 'Tenant', editable: true },
  { key: 'environment', label: 'Environment', editable: true },
  { key: 'dataRegion', label: 'Data region', editable: true },
  { key: 'dataRetention', label: 'Data retention', editable: true },
  { key: 'platformVersion', label: 'Platform version', editable: true },
  { key: 'sessionIngestion', label: 'Session ingestion (24h)', editable: false },
];

export function PlatformSettings() {
  useConsoleTitle('Platform Settings');
  const { session } = useAuth();
  const isAdmin = session?.role === 'Admin';
  const [section, setSection] = useState<SectionKey>('general');

  const settingsQuery = useApi<TenantSettings>(() => consoleApi.settings(), []);
  const [draft, setDraft] = useState<TenantSettings | null>(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Seed the editable draft once settings arrive.
  useEffect(() => {
    if (settingsQuery.data && !draft) setDraft(structuredClone(settingsQuery.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsQuery.data]);

  const dirty = !!draft && !!settingsQuery.data &&
    JSON.stringify(draft) !== JSON.stringify(settingsQuery.data);

  const setNotif = (k: string, v: boolean) =>
    setDraft((d) => d && ({ ...d, notifications: { ...d.notifications, [k]: v } }));
  const setModule = (k: string, v: boolean) =>
    setDraft((d) => d && ({ ...d, modules: { ...d.modules, [k]: v } }));
  const setTenant = (k: string, v: string) =>
    setDraft((d) => d && ({ ...d, tenant: { ...d.tenant, [k]: v } }));

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setSavedMsg('');
    try {
      const updated = await consoleApi.patchSettings({
        tenant: draft.tenant, notifications: draft.notifications, modules: draft.modules,
      });
      setDraft(structuredClone(updated));
      settingsQuery.reload();
      setSavedMsg('✓ Settings saved.');
    } catch (e) {
      setSavedMsg(e instanceof Error ? e.message : 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  const cardStyle: CSSProperties = { background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 };
  const readOnlyNote = !isAdmin && (
    <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2 }}>Read-only — only tenant admins can change settings.</div>
  );

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0,1fr)', gap: 24, alignItems: 'start' }}>
        {/* SECTION NAV */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sections.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSection(s.key)}
              style={{
                textAlign: 'left', padding: '11px 14px', borderRadius: 3, border: 'none', cursor: 'pointer',
                fontFamily: 'Barlow', fontSize: '13.5px', fontWeight: 600, letterSpacing: '0.02em',
                background: section === s.key ? '#FBF1F2' : 'transparent',
                color: section === s.key ? '#D71A28' : '#5A6976',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* SECTION CONTENT */}
        <div>
          {settingsQuery.loading && !draft && section !== 'team' && (
            <div style={cardStyle}>
              <Skeleton w={160} h={16} style={{ marginBottom: 18 }} />
              <SkeletonLines n={4} gap={18} />
            </div>
          )}
          {settingsQuery.error && section !== 'team' && (
            <div style={{ ...cardStyle, fontSize: 13, fontWeight: 600, color: '#D71A28' }}>{settingsQuery.error.message}</div>
          )}

          {section === 'general' && draft && (
            <div style={cardStyle}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Tenant &amp; environment</div>
              {readOnlyNote}
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
                {tenantFields.map((f) => (
                  <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid #F0F2F5', fontSize: '12.5px' }}>
                    <span style={{ color: '#7A8593', whiteSpace: 'nowrap' }}>{f.label}</span>
                    {isAdmin && f.editable ? (
                      <input
                        value={String(draft.tenant[f.key] ?? '')}
                        onChange={(e) => setTenant(f.key, e.target.value)}
                        style={{ fontWeight: 700, textAlign: 'right', fontFamily: 'Open Sans', fontSize: '12.5px', color: '#1E262E', border: '1px solid #E3E7EB', borderRadius: 3, padding: '6px 10px', minWidth: 180 }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, textAlign: 'right' }}>
                        {f.key === 'sessionIngestion' ? `${Number(draft.tenant.sessionIngestion).toLocaleString()} / day` : String(draft.tenant[f.key] ?? '')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'notifications' && draft && (
            <div style={cardStyle}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Notifications</div>
              <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>Where the fraud-ops team is alerted</div>
              {readOnlyNote}
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {Object.entries(draft.notifications).map(([k, on]) => {
                  const label = notifLabels[k] ?? { name: k, desc: '' };
                  return (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F2F5' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{label.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2 }}>{label.desc}</div>
                      </div>
                      <Toggle on={on} onClick={() => isAdmin && setNotif(k, !on)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {section === 'keys' && <ApiKeysSection isAdmin={isAdmin} cardStyle={cardStyle} />}

          {section === 'modules' && draft && (
            <div style={cardStyle}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Platform modules</div>
              <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>Enabled modules for this tenant</div>
              {readOnlyNote}
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {Object.entries(draft.modules).map(([k, on]) => {
                  const label = moduleLabels[k] ?? { name: k, desc: '' };
                  return (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F2F5' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: on ? '#2FBF71' : '#C9CED4' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{label.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2 }}>{label.desc}</div>
                      </div>
                      <Toggle on={on} onClick={() => isAdmin && setModule(k, !on)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {section === 'integrations' && draft && (
            <div style={cardStyle}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Integrations</div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {draft.integrations.map((ig) => (
                  <div key={ig.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F2F5' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{ig.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2 }}>{ig.detail}</div>
                    </div>
                    <Chip color={ig.ok ? '#2FBF71' : '#E67E22'}>{ig.status}</Chip>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'team' && <TeamSection />}

          {section !== 'team' && section !== 'keys' && isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
              <button
                type="button"
                disabled={!dirty || saving}
                onClick={save}
                style={{
                  padding: '13px 24px', background: dirty && !saving ? '#D71A28' : '#E3B4B8', color: '#fff', border: 'none', borderRadius: 3,
                  fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: dirty && !saving ? 'pointer' : 'default',
                }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              {savedMsg && <div style={{ fontSize: '12.5px', fontWeight: 700, color: savedMsg.startsWith('✓') ? '#2FBF71' : '#D71A28' }}>{savedMsg}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ApiKeysSection({ isAdmin, cardStyle }: { isAdmin: boolean; cardStyle: CSSProperties }) {
  const keysQuery = useApi<ApiKey[]>(() => consoleApi.apiKeys(), []);
  const keys = keysQuery.data ?? [];
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [scope, setScope] = useState('read');
  const [error, setError] = useState('');
  const [reveal, setReveal] = useState<{ name: string; key: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isAdmin) {
    return (
      <div style={cardStyle}>
        <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>API keys</div>
        <div style={{ fontSize: '12.5px', color: '#7A8593', marginTop: 8 }}>Only tenant admins can view and manage API keys.</div>
      </div>
    );
  }

  const generate = async () => {
    if (!name.trim()) { setError('Enter a name for the key.'); return; }
    try {
      const k = await consoleApi.createApiKey(name.trim(), scope);
      setReveal({ name: k.name, key: k.key! });
      setName(''); setScope('read'); setFormOpen(false); setError('');
      keysQuery.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the key.');
    }
  };

  const revoke = async (id: string) => {
    await consoleApi.revokeApiKey(id).catch(() => {});
    keysQuery.reload();
  };

  const inputStyle: CSSProperties = {
    padding: '10px 12px', fontSize: 13, fontFamily: 'Open Sans', color: '#1E262E',
    border: '1px solid #E3E7EB', borderRadius: 3, outline: 'none', background: '#fff',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>API keys</div>
          <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>Machine credentials for integrations — shown once at creation.</div>
        </div>
        <button
          type="button"
          onClick={() => { setFormOpen((o) => !o); setError(''); setReveal(null); }}
          style={{
            marginLeft: 'auto', padding: '8px 14px', background: '#fff', color: '#D71A28', border: '1px solid #D71A28',
            borderRadius: 3, fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          {formOpen ? 'Cancel' : 'Generate key'}
        </button>
      </div>

      {formOpen && (
        <div style={{ marginTop: 14, padding: 14, background: '#F7F8FA', border: '1px solid #E3E7EB', borderRadius: 3, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input value={name} placeholder="Key name (e.g. SIEM export)" autoFocus
            onChange={(e) => { setName(e.target.value); setError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') generate(); }}
            style={{ ...inputStyle, flex: '1 1 220px', borderColor: error ? '#D71A28' : '#E3E7EB' }} />
          <select value={scope} onChange={(e) => setScope(e.target.value)} style={{ ...inputStyle, fontWeight: 600, cursor: 'pointer' }}>
            <option value="read">read</option>
            <option value="read/write">read/write</option>
          </select>
          <button type="button" onClick={generate}
            style={{ padding: '10px 18px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3, fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Create key
          </button>
          {error && <div style={{ flexBasis: '100%', fontSize: '11.5px', fontWeight: 700, color: '#D71A28' }}>{error}</div>}
        </div>
      )}

      {reveal && (
        <div style={{ marginTop: 14, padding: 14, background: '#FBF1F2', border: '1px solid #F2D9DB', borderRadius: 3 }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#D71A28' }}>Copy your new key now — it won&apos;t be shown again.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <code style={{ flex: 1, fontFamily: 'monospace', fontSize: '12.5px', color: '#1E262E', overflowWrap: 'anywhere' }}>{reveal.key}</code>
            <button type="button"
              onClick={() => { navigator.clipboard?.writeText(reveal.key).catch(() => {}); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }}
              style={{ ...ghostBtn, color: '#D71A28' }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
        {keysQuery.loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '6px 0' }}>
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F0F2F5' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <Skeleton w={`${28 + ((i * 19) % 18)}%`} h={12} />
                  <Skeleton w={170} h={10} />
                </div>
                <Skeleton w={64} h={22} r={11} />
              </div>
            ))}
          </div>
        )}
        {!keysQuery.loading && keys.length === 0 && (
          <EmptyState
            variant="compact"
            icon={<KeyArt />}
            title="No API keys yet"
            description="Generate a key to let your backend call the ingest and console APIs — the full value is shown once, at creation."
          />
        )}
        {keys.map((ky) => (
          <div key={ky.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F2F5', opacity: ky.revoked ? 0.55 : 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {ky.name}
                {ky.revoked && <span style={{ fontWeight: 600, color: '#D71A28' }}> · revoked</span>}
              </div>
              <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2, fontFamily: 'monospace' }}>
                {ky.prefix}••••{ky.last4}
              </div>
            </div>
            <Chip color={ky.scope === 'read' ? '#2C7BB6' : '#D71A28'}>{ky.scope}</Chip>
            <div style={{ fontSize: '11.5px', color: '#7A8593', whiteSpace: 'nowrap', minWidth: 96, textAlign: 'right' }}>
              {ky.last_used_at ? `used ${new Date(ky.last_used_at).toLocaleDateString()}` : 'never used'}
            </div>
            {!ky.revoked && (
              <button type="button" style={{ ...ghostBtn, color: '#D71A28' }} onClick={() => revoke(ky.id)}>Revoke</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
