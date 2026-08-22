import { useEffect } from 'react';

export function Seo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    const fullTitle = `${title} | VeraWall`;
    document.title = fullTitle;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;

    // Per-route canonical. Preview crawlers never see this (they don't run
    // JS — the static tags in index.html cover them), but Google's renderer
    // does, and it keeps /solutions/* from all claiming the homepage URL.
    let canon = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement('link');
      canon.rel = 'canonical';
      document.head.appendChild(canon);
    }
    canon.href = 'https://verawall.tech' + window.location.pathname;

    // hreflang pair + x-default, derived from the route: every page exists at
    // /x (EN) and /fr/x (FR). Crawlers without JS get the same pairs from the
    // sitemap's xhtml:link entries; this covers Google's renderer.
    const bare = window.location.pathname.replace(/^\/fr(?=\/|$)/, '') || '/';
    const alts: Array<[string, string]> = [
      ['en', 'https://verawall.tech' + bare],
      ['fr', 'https://verawall.tech/fr' + (bare === '/' ? '' : bare)],
      ['x-default', 'https://verawall.tech' + bare],
    ];
    for (const [hl, href] of alts) {
      let link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hl}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hl;
        document.head.appendChild(link);
      }
      link.href = href;
    }
  }, [title, description]);

  return null;
}
