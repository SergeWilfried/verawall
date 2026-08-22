export function Pagination({
  page,
  totalPages,
  onChange,
  totalItems,
  pageSize,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}) {
  if (totalItems === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        padding: '14px 22px', borderTop: '1px solid #E9EDF1',
      }}
    >
      <div style={{ fontSize: '11.5px', color: '#7A8593', fontVariantNumeric: 'tabular-nums' }}>
        {start}–{end} of {totalItems}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="press-scale"
          style={{
            padding: '7px 12px', borderRadius: 3, border: '1px solid #E0E5EA', background: '#fff',
            color: page <= 1 ? '#C9CED4' : '#5A6976', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase', cursor: page <= 1 ? 'default' : 'pointer',
            transition: 'color .15s, transform .15s',
          }}
        >
          ← Prev
        </button>
        {Array.from({ length: totalPages }).map((_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="hit-40 press-scale"
              style={{
                width: 30, height: 30, borderRadius: 3, border: `1px solid ${page === n ? '#D71A28' : '#E0E5EA'}`,
                background: page === n ? '#D71A28' : '#fff', color: page === n ? '#fff' : '#5A6976',
                fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer',
                fontVariantNumeric: 'tabular-nums',
                transition: 'background-color .15s, color .15s, border-color .15s, transform .15s',
              }}
            >
              {n}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="press-scale"
          style={{
            padding: '7px 12px', borderRadius: 3, border: '1px solid #E0E5EA', background: '#fff',
            color: page >= totalPages ? '#C9CED4' : '#5A6976', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase', cursor: page >= totalPages ? 'default' : 'pointer',
            transition: 'color .15s, transform .15s',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
