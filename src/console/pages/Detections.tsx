import { useNavigate } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { consoleApi } from '../api';
import { useApi } from '../useApi';
import { Skeleton } from '../components/Skeleton';

// Explanatory copy per threat type — static text, not fabricated counts.
const descriptions: Record<string, string> = {
  'APP Scam': 'Authorized push-payment, instant-payment, investment and romance scams — coached-session and manipulation patterns detected in real time.',
  Phishing: 'Credentials harvested via phishing infrastructure and financial-malware signatures, flagged before misuse.',
  'Account Takeover': 'Remote-access attacks, session hijacking and SIM swap — unauthorized access flagged by behavioral mismatch.',
  'Money Mule': 'Dormant or fresh accounts used for rapid in-out transfers, identified from the bank-feed ledger.',
  'New Account Fraud': 'Stolen or synthetic identities at onboarding — caught by behavioral and integrity signals.',
  'Agent Commission Fraud': 'Agents splitting a deposit into a burst of small near-identical transactions to farm per-transaction commissions.',
  Unclassified: 'Alerts the scoring engine held without a single dominant threat classification.',
};

export function Detections() {
  useConsoleTitle('Detections');
  const navigate = useNavigate();
  const { data, loading, error } = useApi(() => consoleApi.detections(365), []);
  const rows = data ?? [];
  const maxCount = Math.max(1, ...rows.map((d) => d.count));

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ maxWidth: 760 }}>
        <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D71A28' }}>
          Detections
        </div>
        <div style={{ fontSize: 14, color: '#5A6976', marginTop: 6, lineHeight: 1.6 }}>
          Alerts raised by the Behavioral Intelligence Platform, grouped by threat type. Select a type to open its alerts in the queue.
        </div>
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <Skeleton w={`${52 + ((i * 13) % 28)}%`} h={16} />
                <Skeleton w={34} h={22} />
              </div>
              <Skeleton w="92%" h={12} />
              <Skeleton w="70%" h={12} />
              <Skeleton h={8} r={4} style={{ marginTop: 'auto' }} />
              <Skeleton w={120} h={11} />
            </div>
          ))}
        </div>
      )}
      {error && <div style={{ fontSize: 13, fontWeight: 600, color: '#D71A28' }}>{error.message}</div>}
      {!loading && !error && rows.length === 0 && (
        <div style={{ fontSize: '12.5px', color: '#7A8593' }}>No detections recorded yet.</div>
      )}

      {rows.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16 }}>
          {rows.map((dt) => (
            <div key={dt.threat_type} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontFamily: 'Barlow', fontSize: 16, fontWeight: 700, color: '#3E4753' }}>{dt.threat_type}</div>
                <div style={{ fontFamily: 'Barlow', fontWeight: 800, fontSize: 22, color: dt.count >= 20 ? '#D71A28' : '#3E4753' }}>{dt.count}</div>
              </div>
              <div style={{ fontSize: 13, color: '#5A6976', lineHeight: 1.6, flex: 1 }}>
                {descriptions[dt.threat_type] ?? 'Alerts of this classification.'}
              </div>
              <div style={{ height: 8, background: '#EEF1F4', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((dt.count / maxCount) * 100)}%`, height: '100%', background: '#D71A28', opacity: 0.4 + 0.6 * (dt.count / maxCount), borderRadius: 4 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                <div style={{ fontSize: 12, color: '#7A8593' }}>{dt.open} open · {dt.count} total</div>
                <button
                  type="button"
                  onClick={() => navigate(`/console/alerts?type=${encodeURIComponent(dt.threat_type)}`)}
                  style={{
                    padding: '9px 16px', background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3,
                    fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  View alerts
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
