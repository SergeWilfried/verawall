import { useState } from 'react';
import { useConsoleTitle } from '../TitleContext';
import { intelDefs, severityColors, confirmedDestinations, matchesYourTraffic, type Severity } from '../../data/console/intel';
import { Chip } from '../components/Chip';
import { consoleApi, type CounterpartyType } from '../api';
import { useApi } from '../useApi';
import { useAuth } from '../auth';

// Counterparty typing — the registry behind GAMBLING_PAYEE / GAMBLING_FLOW /
// CRYPTO_INFLOW_CONCENTRATION. Lives on this page because it answers the
// same analyst question as payee intel ("who are we dealing with?") — but a
// type is context, not verdict, so the chips stay neutral, never red.
const categoryColors: Record<string, string> = {
  GAMBLING: '#8E44AD', CRYPTO_P2P: '#2C7BB6', INFORMAL_FX: '#E67E22', BENIGN: '#16A085',
};

function CounterpartyRegistry() {
  const { session } = useAuth();
  const canEdit = (session?.rank ?? 0) >= 1;
  const typesQuery = useApi<CounterpartyType[]>(() => consoleApi.counterpartyTypes(), []);
  const [ref, setRef] = useState('');
  const [category, setCategory] = useState('GAMBLING');
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!ref.trim()) return;
    setBusy(true); setErr('');
    try {
      await consoleApi.upsertCounterpartyType(ref.trim(), category, label.trim() || undefined);
      setRef(''); setLabel('');
      typesQuery.reload();
    } catch {
      setErr('Could not save — check the reference and try again.');
    } finally {
      setBusy(false);
    }
  }

  const rows = typesQuery.data ?? [];
  const input: React.CSSProperties = {
    padding: '9px 12px', border: '1px solid #E0E5EA', borderRadius: 3, fontSize: 13,
    fontFamily: "'Open Sans', sans-serif",
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6 }}>
      <div style={{ padding: '18px 22px', borderBottom: '1px solid #E9EDF1' }}>
        <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Counterparty types</div>
        <div style={{ fontSize: 12, color: '#7A8593', marginTop: 2, maxWidth: '62ch', lineHeight: 1.55 }}>
          What kind of counterparty is this? Types feed the score-time context signals and the
          gambling / crypto flow ratios. Context, not verdict — a type alone never challenges a payment.
        </div>
      </div>
      {canEdit && (
        <form onSubmit={add} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', padding: '14px 22px', borderBottom: '1px solid #F0F2F5' }}>
          <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Counterparty ref…" aria-label="Counterparty reference" style={{ ...input, width: 220, fontFamily: 'monospace' }} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category" style={{ ...input, cursor: 'pointer' }}>
            {Object.keys(categoryColors).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (optional)…" aria-label="Label" style={{ ...input, width: 200 }} />
          <button type="submit" className="press-scale" disabled={busy || !ref.trim()}
            style={{ padding: '9px 18px', borderRadius: 3, border: 'none', background: ref.trim() && !busy ? '#D71A28' : '#E9AEB2', color: '#fff', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color .15s, transform .15s' }}>
            {busy ? '…' : 'Type it'}
          </button>
          {err && <span style={{ fontSize: 12, color: '#D71A28', fontWeight: 600 }}>{err}</span>}
        </form>
      )}
      {rows.length === 0 ? (
        <div style={{ padding: '18px 22px', fontSize: 13, color: '#7A8593' }}>
          No typed counterparties yet. The registry is the product — the betting collection
          accounts and P2P off-ramps your analysts already know belong here.
        </div>
      ) : (
        rows.map((r) => (
          <div key={r.counterparty_ref} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 22px', borderBottom: '1px solid #F0F2F5' }}>
            <code style={{ fontSize: 12.5, fontWeight: 700, color: '#1E262E' }}>{r.counterparty_ref}</code>
            <Chip color={categoryColors[r.category] ?? '#5A6976'}>{r.category}</Chip>
            {r.label && <span style={{ fontSize: 12.5, color: '#5A6976' }}>{r.label}</span>}
            <span style={{ marginLeft: 'auto', fontSize: 11.5, color: '#9AA4AF' }} title={r.created_by}>
              {r.source}{r.created_by ? ` · ${r.created_by.split('@')[0]}` : ''}
            </span>
            {canEdit && (
              <button type="button" onClick={() => { void consoleApi.deleteCounterpartyType(r.counterparty_ref).then(() => typesQuery.reload()); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A8593', fontSize: 12, fontFamily: 'Barlow', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Remove
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

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
      <CounterpartyRegistry />
    </div>
  );
}
