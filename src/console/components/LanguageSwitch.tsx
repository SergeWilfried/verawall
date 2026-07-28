import { useTranslation } from 'react-i18next';
import { SUPPORTED, setLanguage, type Lang } from '../i18n';

const LABELS: Record<Lang, string> = { en: 'EN', fr: 'FR' };

/**
 * Compact EN/FR segmented toggle. `variant="dark"` is for placement on dark
 * surfaces (the sign-in shell); the default suits light menus.
 */
export function LanguageSwitch({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { i18n, t } = useTranslation();
  const current = (SUPPORTED as readonly string[]).includes(i18n.language) ? (i18n.language as Lang) : 'en';
  const dark = variant === 'dark';

  return (
    <div
      role="group"
      aria-label={t('userMenu.language')}
      style={{
        display: 'inline-flex',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.28)' : '#E0E5EA'}`,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {SUPPORTED.map((lng, i) => {
        const active = current === lng;
        return (
          <button
            key={lng}
            type="button"
            aria-pressed={active}
            onClick={() => setLanguage(lng)}
            style={{
              padding: '5px 12px',
              border: 'none',
              borderLeft: i > 0 ? `1px solid ${dark ? 'rgba(255,255,255,0.28)' : '#E0E5EA'}` : 'none',
              background: active ? '#D71A28' : 'transparent',
              color: active ? '#fff' : dark ? '#C9CCCF' : '#5A6976',
              fontFamily: 'Barlow',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              cursor: active ? 'default' : 'pointer',
            }}
          >
            {LABELS[lng]}
          </button>
        );
      })}
    </div>
  );
}
