import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';

// Console localization. Analyst's own choice is persisted in localStorage
// (follows them on this device, and is available pre-login so the sign-in page
// can render translated). The tenant's default language lives in
// tenant_settings and is applied on login only when the analyst hasn't made an
// explicit choice — see applyTenantDefault below.
export const LANG_KEY = 'vw_lang';
export const SUPPORTED = ['en', 'fr'] as const;
export type Lang = (typeof SUPPORTED)[number];

function readSaved(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === 'en' || v === 'fr' ? v : null;
  } catch {
    return null;
  }
}

function navigatorDefault(): Lang {
  try {
    return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  } catch {
    return 'en';
  }
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr } },
  lng: readSaved() ?? navigatorDefault(),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED as unknown as string[],
  interpolation: { escapeValue: false },
});

/** Analyst explicitly picked a language — persists on this device. */
export function setLanguage(lng: Lang): void {
  i18n.changeLanguage(lng);
  try {
    localStorage.setItem(LANG_KEY, lng);
  } catch {
    /* private mode / disabled storage — session-only is fine */
  }
}

/** True once the analyst has made an explicit choice on this device. */
export function hasExplicitLanguage(): boolean {
  return readSaved() !== null;
}

/**
 * Apply the tenant's default language, but never override an explicit
 * per-analyst choice. Not persisted, so it stays a default the analyst can
 * still override.
 */
export function applyTenantDefault(lng: string | undefined): void {
  if (hasExplicitLanguage()) return;
  if (lng === 'en' || lng === 'fr') i18n.changeLanguage(lng);
}

export default i18n;
