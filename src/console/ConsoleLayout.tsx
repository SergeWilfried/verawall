import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { navGroups } from '../data/console/nav';
import { roleColors } from '../data/console/settings';
import { ConsoleTitleProvider, useConsoleTitleValue } from './TitleContext';
import { useAuth } from './auth';
import { consoleApi, shortRef, subjectLabel } from './api';
import type { SearchResults } from './api';
import { scoreColor } from '../data/console/alerts';
import { useApi } from './useApi';
import { Chip } from './components/Chip';
import { LanguageSwitch } from './components/LanguageSwitch';
import { applyTenantDefault } from './i18n';

function Sidebar() {
  const { t } = useTranslation();
  // Live open-alert count overrides the static "Alert Queue" badge.
  const { data: stats } = useApi(() => consoleApi.overview(), []);
  const liveBadge = (to?: string) =>
    to === '/console/alerts' && stats ? String(stats.openAlerts) : undefined;

  return (
    <aside style={{ width: 248, flexShrink: 0, background: '#1D1D1B', color: '#EAEAEA', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '22px 20px', borderBottom: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <svg width="30" height="30" viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
            <path d="M14 1 L26 5.5 V13 C26 20.5 21 25.5 14 27.5 C7 25.5 2 20.5 2 13 V5.5 Z" fill="#D71A28" />
            <path d="M8.5 9.5 L14 19.5 L19.5 9.5" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 22, letterSpacing: '0.01em', color: '#FFFFFF' }}>VeraWall</span>
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', padding: '4px 12px 12px', gap: 2, overflowY: 'auto' }}>
        {navGroups.map((group) => (
          <div key={group.id}>
            <div
              style={{
                padding: '16px 8px 6px',
                fontFamily: 'Barlow',
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8A8F94',
              }}
            >
              {t(`nav.groups.${group.id}`)}
            </div>
            {group.items.map((item) =>
              item.to ? (
                <NavLink
                  key={item.id}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    textAlign: 'left',
                    padding: '11px 12px',
                    borderRadius: 3,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Barlow',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    background: isActive ? '#D71A28' : 'transparent',
                    color: isActive ? '#fff' : '#C9CCCF',
                  })}
                >
                  {({ isActive }) => {
                    const badge = liveBadge(item.to) ?? item.badge;
                    return (
                      <>
                        {t(`nav.items.${item.id}`)}
                        {badge && (
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: 10,
                              background: isActive ? 'rgba(255,255,255,0.25)' : '#D71A28',
                              color: '#fff',
                            }}
                          >
                            {badge}
                          </span>
                        )}
                      </>
                    );
                  }}
                </NavLink>
              ) : (
                <span
                  key={item.id}
                  title="Not included in this preview"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: 3,
                    fontFamily: 'Barlow',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    color: '#5A5F63',
                    cursor: 'default',
                  }}
                >
                  {t(`nav.items.${item.id}`)}
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 10,
                        background: '#3A3D40',
                        color: '#8A8F94',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
              ),
            )}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '18px 20px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ fontSize: 12, color: '#8A8F94' }}>{t('sidebar.fusionCenter')}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2FBF71', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#EAEAEA' }}>{t('sidebar.monitoring')}</span>
        </div>
      </div>
    </aside>
  );
}

// Global search: jump straight to an alert (by id) or a subject (by ref).
// Debounced; the dropdown groups alerts and subjects, Enter opens the first
// hit, Escape/click-outside closes.
function GlobalSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [res, setRes] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setRes(null); return; }
    let alive = true;
    const t = setTimeout(() => {
      consoleApi.search(term).then((r) => { if (alive) { setRes(r); setOpen(true); } }).catch(() => {});
    }, 180);
    return () => { alive = false; clearTimeout(t); };
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const go = (href: string) => { setOpen(false); setQ(''); setRes(null); navigate(href); };
  const alerts = res?.alerts ?? [];
  const subjects = res?.subjects ?? [];
  const empty = q.trim().length >= 2 && alerts.length === 0 && subjects.length === 0;

  const first = () => {
    if (alerts[0]) go(`/console/alerts/${alerts[0].id}`);
    else if (subjects[0]) go(`/console/customers/${subjects[0].user_ref}`);
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
    padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer',
    borderTop: '1px solid #F0F2F5', fontSize: '12.5px', color: '#3E4753',
  };
  const groupLabel: React.CSSProperties = {
    fontFamily: 'Barlow', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: '#9AA4AF', padding: '10px 14px 4px',
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F4F6F8', border: `1px solid ${open ? '#D71A28' : '#E3E7EB'}`, borderRadius: 3, padding: '0 12px' }}>
        <span style={{ color: '#9AA4AF', fontSize: 14 }} aria-hidden>⌕</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { if (res) setOpen(true); }}
          onKeyDown={(e) => { if (e.key === 'Enter') first(); if (e.key === 'Escape') setOpen(false); }}
          placeholder={t('topbar.searchPlaceholder')}
          aria-label={t('topbar.searchPlaceholder')}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '9px 0', fontSize: 13, color: '#1E262E' }}
        />
      </div>

      {open && (alerts.length > 0 || subjects.length > 0 || empty) && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: 340, background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, boxShadow: '0 6px 16px rgba(30,38,46,0.12)', zIndex: 50, overflow: 'hidden', maxHeight: 420, overflowY: 'auto' }}>
          {empty && <div style={{ padding: '16px 14px', fontSize: '12.5px', color: '#7A8593' }}>{t('search.noMatches', { q: q.trim() })}</div>}
          {alerts.length > 0 && (
            <>
              <div style={groupLabel}>{t('search.alerts')}</div>
              {alerts.map((a) => (
                <button key={a.id} type="button" style={itemStyle} onClick={() => go(`/console/alerts/${a.id}`)}>
                  <span style={{ display: 'inline-flex', width: 34, height: 22, borderRadius: 3, background: scoreColor(a.score), color: '#fff', fontFamily: 'Barlow', fontWeight: 800, fontSize: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.score}</span>
                  <span style={{ fontFamily: 'Barlow', fontWeight: 700 }}>{a.id}</span>
                  <span style={{ color: '#7A8593', fontSize: 11.5, marginLeft: 'auto' }}>{a.threat_type || t('search.unclassified')} · {a.state}</span>
                </button>
              ))}
            </>
          )}
          {subjects.length > 0 && (
            <>
              <div style={groupLabel}>{t('search.subjects')}</div>
              {subjects.map((s) => (
                <button key={s.user_ref} type="button" style={itemStyle} onClick={() => go(`/console/customers/${s.user_ref}`)}>
                  <span style={{ fontWeight: 700 }}>{subjectLabel(s.user_ref)}</span>
                  <span style={{ fontFamily: 'monospace', color: '#9AA4AF', fontSize: 11 }}>{shortRef(s.user_ref, 10)}</span>
                  <span style={{ color: '#7A8593', fontSize: 11.5, marginLeft: 'auto' }}>{t('search.alertCount', { count: s.alerts })}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Topbar() {
  const { t } = useTranslation();
  const title = useConsoleTitleValue();
  return (
    <div style={{ height: 64, background: '#fff', borderBottom: '1px solid #E3E7EB', display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px' }}>
      <h1 style={{ fontFamily: 'Barlow', fontSize: 18, fontWeight: 700 }}>{title}</h1>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
        <GlobalSearch />
        <div
          style={{
            fontFamily: 'Barlow',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '8px 14px',
            background: '#FBF1F2',
            color: '#D71A28',
            borderRadius: 3,
          }}
        >
          {t('topbar.tenantLabel')}: Demo Bank
        </div>
        <UserMenu />
      </div>
    </div>
  );
}

function UserMenu() {
  const { t } = useTranslation();
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  if (!session) return null;
  const initials = session.name.split(' ').map((w) => w[0]).join('').replace('.', '').slice(0, 2).toUpperCase();

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={session.name}
        style={{
          width: 36, height: 36, borderRadius: '50%', background: '#D71A28', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Barlow', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
          outline: open ? '2px solid #F2D9DB' : 'none', outlineOffset: 2,
        }}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 248,
            background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6,
            boxShadow: '0 4px 8px rgba(30,38,46,0.10)', zIndex: 40, overflow: 'hidden',
          }}
        >
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F2F5' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 14, fontWeight: 700, color: '#1E262E' }}>{session.name}</div>
            <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2, overflowWrap: 'anywhere' }}>{session.email}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Chip color={roleColors[session.role] || '#7A8593'}>{session.role}</Chip>
              {session.mfaEnrolled && <Chip color="#2FBF71">{t('userMenu.twoFA')}</Chip>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 16px', borderBottom: '1px solid #F0F2F5' }}>
            <span style={{ fontFamily: 'Barlow', fontSize: '12.5px', fontWeight: 700, color: '#5A6976' }}>{t('userMenu.language')}</span>
            <LanguageSwitch />
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => { signOut(); navigate('/console/login', { replace: true }); }}
            style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Barlow', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.03em',
              color: '#D71A28',
            }}
          >
            {t('userMenu.signOut')}
          </button>
        </div>
      )}
    </div>
  );
}

export function ConsoleLayout() {
  // Apply the tenant's default language once authenticated — but never over an
  // analyst's own explicit choice (applyTenantDefault guards that).
  useEffect(() => {
    consoleApi.settings().then((s) => applyTenantDefault(s.language)).catch(() => {});
  }, []);

  return (
    <ConsoleTitleProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F6F8', fontFamily: 'Open Sans, sans-serif', color: '#3E4753' }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Topbar />
          <Outlet />
        </main>
      </div>
    </ConsoleTitleProvider>
  );
}
