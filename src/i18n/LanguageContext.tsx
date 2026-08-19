import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { dict } from './dict';

type Lang = 'en' | 'fr';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Persist the choice so a reload or an in-app navigation keeps the language.
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('vw_lang');
      if (saved === 'fr' || saved === 'en') return saved;
      if (typeof navigator !== 'undefined' && /^fr\b/i.test(navigator.language)) return 'fr';
    } catch {
      /* storage unavailable */
    }
    return 'en';
  });
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('vw_lang', l);
    } catch {
      /* ignore */
    }
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (text: string) => (lang === 'fr' ? dict[text] ?? text : text),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
