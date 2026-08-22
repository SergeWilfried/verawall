import { Link, type LinkProps } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

// Language-aware Link for the marketing pages: on the French tree every
// internal path gains the /fr prefix, so navigation stays inside the
// language the visitor chose (and the crawler indexed). The console is
// exempt — it has its own i18n and its URLs must not vary by site language.
//
// Marketing components import this as `Link`, so call sites are unchanged.
export function LocalizedLink({ to, ...rest }: LinkProps) {
  const { lang } = useLanguage();
  let target = to;
  if (lang === 'fr' && typeof to === 'string' && to.startsWith('/') && !to.startsWith('/fr') && !to.startsWith('/console')) {
    // '/' -> '/fr', '/x' -> '/fr/x', '/#hash' -> '/fr#hash'
    target = to === '/' ? '/fr' : to.startsWith('/#') ? '/fr' + to.slice(1) : '/fr' + to;
  }
  return <Link to={target} {...rest} />;
}
