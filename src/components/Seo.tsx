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
    canon.href = 'https://verawall.com' + window.location.pathname;
  }, [title, description]);

  return null;
}
