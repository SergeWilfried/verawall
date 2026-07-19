export function TagBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: '10.5px', fontWeight: 600,
        color: '#5A6976', background: '#F0F2F5', border: '1px solid #E3E7EB', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/** Splits "Label (tag)" or "Label — tag" into a main label and an optional trailing tag. */
export function splitTag(text: string): { label: string; tag?: string } {
  const paren = text.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (paren) return { label: paren[1], tag: paren[2] };

  const dash = text.match(/^(.*?)\s+—\s+(.+)$/);
  if (dash) return { label: dash[1], tag: dash[2] };

  return { label: text };
}
