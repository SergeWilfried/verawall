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
  }, [title, description]);

  return null;
}
