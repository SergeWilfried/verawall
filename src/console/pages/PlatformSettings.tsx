import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useConsoleTitle } from '../TitleContext';
import {
  tenantInfo, moduleToggleDefs, notifDefs, integrationDefs, roleColors, keyDefs,
} from '../../data/console/settings';
import { Chip } from '../components/Chip';
import { Toggle } from '../components/Toggle';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../usePagination';
import { useAuth } from '../auth';
import { consoleApi, displayRole, expiryLabel, serverRole } from '../api';
import type { ServerInvitation, ServerRole, TeamMember } from '../api';
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
          <div style={{ fontSize: '12.5px', color: '#7A8593', padding: '12px 0' }}>Loading team…</div>
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

export function PlatformSettings() {
  useConsoleTitle('Platform Settings');
  const [section, setSection] = useState<SectionKey>('general');
  const [off, setOff] = useState<Record<string, boolean>>({});
  const [keys, setKeys] = useState(keyDefs);
  const [savedMsg, setSavedMsg] = useState('');

  const toggle = (key: string) => {
    setOff((cur) => ({ ...cur, [key]: !cur[key] }));
    setSavedMsg('');
  };

  const generateKey = () => {
    setKeys((cur) => [
      ...cur,
      { name: 'New key — unnamed', masked: `tm_live_ •••• ${Math.random().toString(16).slice(2, 6)}`, scope: 'read', used: 'never used' },
    ]);
    setSavedMsg('');
  };

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
          {section === 'general' && (
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Tenant &amp; environment</div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
                {tenantInfo.map((tv) => (
                  <div key={tv.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid #F0F2F5', fontSize: '12.5px' }}>
                    <span style={{ color: '#7A8593', whiteSpace: 'nowrap' }}>{tv.k}</span>
                    <span style={{ fontWeight: 700, textAlign: 'right' }}>{tv.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Notifications</div>
              <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>Where the fraud-ops team is alerted</div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {notifDefs.map((nf) => {
                  const key = `nf_${nf.key}`;
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F2F5' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{nf.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2 }}>{nf.desc}</div>
                      </div>
                      <Toggle on={!off[key]} onClick={() => toggle(key)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {section === 'keys' && (
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>API keys</div>
                <button
                  type="button"
                  onClick={generateKey}
                  style={{
                    marginLeft: 'auto', padding: '8px 14px', background: '#fff', color: '#D71A28', border: '1px solid #D71A28',
                    borderRadius: 3, fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  Generate key
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {keys.map((ky) => (
                  <div key={ky.name + ky.masked} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F2F5' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{ky.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2, fontFamily: 'monospace' }}>{ky.masked}</div>
                    </div>
                    <Chip color={ky.scope === 'read' ? '#2C7BB6' : '#D71A28'}>{ky.scope}</Chip>
                    <div style={{ fontSize: '11.5px', color: '#7A8593', whiteSpace: 'nowrap' }}>{ky.used}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'modules' && (
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Platform modules</div>
              <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2 }}>Disabling a module stops its detections within minutes</div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {moduleToggleDefs.map((md) => (
                  <div key={md.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F2F5' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: off[md.key] ? '#C9CED4' : '#2FBF71' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{md.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2 }}>{md.desc}</div>
                    </div>
                    <Toggle on={!off[md.key]} onClick={() => toggle(md.key)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'integrations' && (
            <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Integrations</div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {integrationDefs.map((ig) => (
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
            <button
              type="button"
              onClick={() => setSavedMsg('✓ Settings saved — changes propagate to all detection nodes within 5 minutes.')}
              style={{
                padding: '13px 24px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3,
                fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Save changes
            </button>
            {savedMsg && <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2FBF71' }}>{savedMsg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
