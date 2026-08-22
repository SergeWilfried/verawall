import { scoreColor } from '../../data/console/alerts';

export function ScoreBadge({ score, size = 44 }: { score: number; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Barlow',
        fontWeight: 800,
        fontSize: size * 0.34,
        color: '#fff',
        flexShrink: 0,
        background: scoreColor(score),
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {score}
    </div>
  );
}
