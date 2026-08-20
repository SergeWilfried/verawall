import { useState } from 'react';
import { useConsoleTitle } from '../TitleContext';
import { intelDefs, severityColors, confirmedDestinations, matchesYourTraffic, type Severity } from '../../data/console/intel';
import { Chip } from '../components/Chip';

const filters = ['All', 'Critical', 'High', 'Medium'] as const;

export function PayeeIntel() {
  useConsoleTitle('Payee Intelligence');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');

  const visible = filter === 'All' ? intelDefs : intelDefs.filter((it) => it.severity === filter);

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#1D1D1B', color: '#EAEAEA', borderRadius: 6, padding: 22 }}>
        <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700, color: '#fff' }}>Payee intelligence</div>
        <div style={{ fontSize: 12, color: '#8A8F94', marginTop: 2 }}>Confirmed fraud destinations and open investigations on your book — applied automatically at score time</div>
        <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
          <div>
            <div style={{ fontFamily: 'Barlow', fontSize: 24, fontWeight: 800, color: '#fff' }}>{intelDefs.length}</div>
            <div style={{ fontSize: 11, color: '#8A8F94' }}>active campaigns</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Barlow', fontSize: 24, fontWeight: 800, color: '#fff' }}>{confirmedDestinations}</div>
            <div style={{ fontSize: 11, color: '#8A8F94' }}>confirmed destinations</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Barlow', fontSize: 24, fontWeight: 800, color: '#D71A28' }}>{matchesYourTraffic}</div>
            <div style={{ fontSize: 11, color: '#8A8F94' }}>match your traffic</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {filters.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setFilter(label)}
            style={{
              padding: '7px 14px', borderRadius: 3, border: `1px solid ${filter === label ? '#D71A28' : '#E0E5EA'}`,
              background: filter === label ? '#D71A28' : '#fff', color: filter === label ? '#fff' : '#5A6976',
              fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16 }}>
        {visible.map((it) => (
          <div
            key={it.name}
            style={{
              background: '#fff', border: '1px solid #E3E7EB', borderLeft: `3px solid ${severityColors[it.severity as Severity]}`,
              borderRadius: 6, padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontFamily: 'Barlow', fontWeight: 700, fontSize: '14.5px' }}>{it.name}</div>
              <Chip color={severityColors[it.severity as Severity]}>{it.severity}</Chip>
            </div>
            <div style={{ fontSize: '12.5px', color: '#5A6976', marginTop: 8, lineHeight: 1.55 }}>{it.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, fontSize: '11.5px', color: '#7A8593' }}>
              <span>{it.region}</span><span>·</span><span>source: {it.source}</span><span>·</span><span>{it.when}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
