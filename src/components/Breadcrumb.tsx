import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Breadcrumb"
      style={{ maxWidth: 1080, margin: '0 auto', padding: '26px 15px 0', display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#5A6976' }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} style={{ display: 'contents' }}>
            {i > 0 && <span style={{ color: '#C9CED4' }}>›</span>}
            {item.to && !isLast ? (
              <Link to={item.to} className="link-hover">
                {t(item.label)}
              </Link>
            ) : (
              <span style={{ color: isLast ? '#7A8593' : undefined }} aria-current={isLast ? 'page' : undefined}>
                {t(item.label)}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
