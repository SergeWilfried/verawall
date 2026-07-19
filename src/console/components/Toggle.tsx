export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={{
        width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', position: 'relative',
        flexShrink: 0, background: on ? '#D71A28' : '#C9CED4', transition: 'background .2s',
      }}
    >
      <span
        style={{
          position: 'absolute', top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left .2s',
        }}
      />
    </button>
  );
}
