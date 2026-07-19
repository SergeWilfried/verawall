import type { CSSProperties } from 'react';

export function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  const style: CSSProperties = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 3,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'Barlow',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color,
    background: '#F7F8FA',
    border: '1px solid #E3E7EB',
  };
  return <span style={style}>{children}</span>;
}
