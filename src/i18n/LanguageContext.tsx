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
  const [lang, setLang] = useState<Lang>('en');

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
