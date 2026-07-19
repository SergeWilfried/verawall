import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { navGroups } from '../data/console/nav';
import { roleColors } from '../data/console/settings';
import { ConsoleTitleProvider, useConsoleTitleValue } from './TitleContext';
import { useAuth } from './auth';
import { consoleApi } from './api';
import { useApi } from './useApi';
import { Chip } from './components/Chip';

function Sidebar() {
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
          <div key={group.title}>
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
              {group.title}
            </div>
            {group.items.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
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
                        {item.label}
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
                  key={item.label}
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
                  {item.label}
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
        <div style={{ fontSize: 12, color: '#8A8F94' }}>Cyber Fraud Fusion Center</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2FBF71', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#EAEAEA' }}>Live — 24/7 monitoring</span>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  const title = useConsoleTitleValue();
  return (
    <div style={{ height: 64, background: '#fff', borderBottom: '1px solid #E3E7EB', display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px' }}>
      <h1 style={{ fontFamily: 'Barlow', fontSize: 18, fontWeight: 700 }}>{title}</h1>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#F4F6F8',
            border: '1px solid #E3E7EB',
            borderRadius: 3,
            padding: '8px 14px',
            fontSize: 13,
            color: '#7A8593',
            width: 260,
          }}
        >
          ⌕ Search user, account, device…
        </div>
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
          Tenant: Demo Bank
        </div>
        <UserMenu />
      </div>
    </div>
  );
}

function UserMenu() {
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
              {session.mfaEnrolled && <Chip color="#2FBF71">2FA on</Chip>}
            </div>
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
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function ConsoleLayout() {
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
