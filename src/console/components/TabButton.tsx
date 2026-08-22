export function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press-scale"
      style={{
        padding: '10px 18px', borderRadius: 3, border: `1px solid ${active ? '#D71A28' : '#E0E5EA'}`,
        background: active ? '#D71A28' : '#fff', color: active ? '#fff' : '#5A6976',
        fontFamily: 'Barlow', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.06em',
        textTransform: 'uppercase', cursor: 'pointer',
        transition: 'background-color .15s, color .15s, border-color .15s, transform .15s',
      }}
    >
      {children}
    </button>
  );
}
