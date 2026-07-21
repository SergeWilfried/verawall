// Empty states for the console. Three variants: `hero` (page-level, with an
// illustration), `compact` (panel-level, small icon), `celebration` (a good
// empty — e.g. a clear queue). Styled to the console language: Barlow
// headings, #D71A28 accents, square radii, the grey scale used everywhere.
import type { CSSProperties, ReactNode } from 'react';

const T = {
  eyebrow: {
    fontFamily: 'Barlow',
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
    color: '#D71A28',
    fontWeight: 700,
    marginBottom: 10,
  },
  titleHero: {
    fontFamily: 'Barlow',
    fontSize: 20,
    fontWeight: 700,
    color: '#1D1D1B',
    lineHeight: 1.25,
    marginBottom: 8,
    maxWidth: 380,
  },
  titleMd: {
    fontFamily: 'Barlow',
    fontSize: 15,
    fontWeight: 700,
    color: '#3E4753',
    marginBottom: 5,
  },
  descHero: {
    fontSize: 13,
    color: '#5A6976',
    lineHeight: 1.6,
    maxWidth: 400,
    marginBottom: 20,
  },
  descMd: {
    fontSize: '12.5px',
    color: '#7A8593',
    lineHeight: 1.55,
    maxWidth: 320,
    marginBottom: 14,
  },
};

interface FilterTweak { icon?: ReactNode; label: ReactNode; kbd?: string; onClick?: () => void }
interface Tip { text: ReactNode }

interface EmptyStateProps {
  variant?: 'hero' | 'compact' | 'celebration';
  icon?: ReactNode;
  iconStyle?: CSSProperties;
  emoji?: ReactNode;
  celebrationStyle?: CSSProperties;
  illustration?: ReactNode;
  eyebrow?: ReactNode;
  eyebrowColor?: string;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  suggestedActions?: ReactNode;
  filterTweaks?: FilterTweak[];
  tips?: Tip[];
}

function Tips({ tips }: { tips: Tip[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', marginTop: 20, width: '100%', maxWidth: 380 }}>
      {tips.map((tip, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 13px', background: '#F7F8FA', border: '1px solid #E9EDF1', borderRadius: 4, fontSize: 12, lineHeight: 1.5 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#D71A28', color: '#fff', fontFamily: 'Barlow', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
          <div style={{ color: '#3E4753' }}>{tip.text}</div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState(props: EmptyStateProps) {
  if (props.variant === 'compact') {
    const { icon, iconStyle, title, description, actions, suggestedActions, filterTweaks } = props;
    return (
      <div style={{
        flex: 1, padding: '32px 24px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        {icon && (
          <div style={{
            width: 56, height: 56, borderRadius: 4,
            background: '#FBF1F2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#D71A28',
            marginBottom: 14,
            ...iconStyle,
          }}>
            <div style={{ display: 'flex' }}>{icon}</div>
          </div>
        )}
        <div style={T.titleMd}>{title}</div>
        {description && <div style={T.descMd}>{description}</div>}
        {actions}
        {suggestedActions && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 14 }}>
            {suggestedActions}
          </div>
        )}
        {filterTweaks && filterTweaks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, width: '100%', maxWidth: 320 }}>
            {filterTweaks.map((t, i) => (
              <div key={i} onClick={t.onClick} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                background: '#fff',
                border: '1px solid #E3E7EB',
                borderRadius: 4, cursor: t.onClick ? 'pointer' : 'default', fontSize: '12.5px', textAlign: 'left',
              }}>
                <span style={{ color: '#7A8593', flexShrink: 0, display: 'flex' }}>{t.icon}</span>
                <span style={{ flex: 1, color: '#3E4753', fontWeight: 600 }}>{t.label}</span>
                {t.kbd && (
                  <kbd style={{ fontFamily: 'monospace', fontSize: 10, padding: '2px 5px', background: '#F0F2F5', borderRadius: 3, color: '#7A8593', fontWeight: 700 }}>{t.kbd}</kbd>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (props.variant === 'celebration') {
    const { emoji, illustration, celebrationStyle, eyebrow, eyebrowColor, title, description, actions, tips } = props;
    return (
      <div style={{
        flex: 1, padding: '40px 28px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'radial-gradient(circle, #EAF7F0 0%, rgba(47,191,113,0.06) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18, position: 'relative',
          ...celebrationStyle,
        }}>
          <style>{`@keyframes vw-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .vw-empty-ring { animation: none !important; } }`}</style>
          <div className="vw-empty-ring" style={{
            position: 'absolute', inset: -10, borderRadius: '50%',
            border: '2px dashed rgba(47, 191, 113, 0.35)',
            animation: 'vw-spin-slow 30s linear infinite',
          }} />
          <span style={{ zIndex: 1, display: 'flex', fontSize: 34 }}>{illustration ?? emoji}</span>
        </div>
        {eyebrow && (
          <div style={{ ...T.eyebrow, color: eyebrowColor ?? '#2FBF71' }}>{eyebrow}</div>
        )}
        <div style={T.titleHero}>{title}</div>
        {description && <div style={T.descHero}>{description}</div>}
        {actions}
        {tips && tips.length > 0 && <Tips tips={tips} />}
      </div>
    );
  }

  /* hero (default) */
  const { illustration, eyebrow, eyebrowColor, title, description, actions, suggestedActions, tips } = props;
  return (
    <div style={{
      flex: 1, padding: '44px 28px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      position: 'relative',
    }}>
      {illustration && (
        <div style={{ width: 140, height: 140, marginBottom: 20, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(215,26,40,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {illustration}
          </div>
        </div>
      )}
      {eyebrow && (
        <div style={{ ...T.eyebrow, color: eyebrowColor ?? '#D71A28' }}>{eyebrow}</div>
      )}
      <div style={T.titleHero}>{title}</div>
      {description && <div style={T.descHero}>{description}</div>}
      {actions}
      {suggestedActions && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 14 }}>
          {suggestedActions}
        </div>
      )}
      {tips && tips.length > 0 && <Tips tips={tips} />}
    </div>
  );
}

/* ── Suggest chip — matches the console's secondary button language ── */
export function SuggestChip({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '8px 14px',
      background: '#fff',
      border: '1px solid #E0E5EA',
      borderRadius: 3,
      fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: '#5A6976', cursor: 'pointer',
    }}>
      {children}
    </button>
  );
}

/* ── Inline empty (dashed row, for feed/list slots inside cards) ──── */
export function EmptyInline({ message, action }: { message: ReactNode; action?: ReactNode }) {
  return (
    <div style={{
      padding: '22px 18px', textAlign: 'center',
      border: '1.5px dashed #D9DEE4',
      borderRadius: 4, background: '#F7F8FA',
    }}>
      <div style={{ fontSize: '12.5px', color: '#7A8593', lineHeight: 1.5, marginBottom: action ? 12 : 0 }}>
        {message}
      </div>
      {action}
    </div>
  );
}
