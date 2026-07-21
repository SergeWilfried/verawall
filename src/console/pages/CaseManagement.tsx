import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsoleTitle } from '../TitleContext';
import { statusColors } from '../../data/console/cases';
import { typeColors } from '../../data/console/alerts';
import type { ThreatType } from '../../data/console/types';
import { Chip } from '../components/Chip';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../usePagination';
import { consoleApi, subjectLabel } from '../api';
import type { CaseDetail, ServerCase } from '../api';
import { useApi } from '../useApi';

const PAGE_SIZE = 8;
const filters = ['All', 'Investigating', 'Escalated', 'Pending', 'Closed'] as const;
const threatColor = (t: string | null) => (t && typeColors[t as ThreatType]) || '#7A8593';
const relAge = (iso: string) => {
  const h = (Date.now() - new Date(iso).getTime()) / 3.6e6;
  if (h < 1) return `${Math.max(1, Math.round(h * 60))}m`;
  if (h < 48) return `${Math.round(h)}h`;
  return `${Math.round(h / 24)}d`;
};

export function CaseManagement() {
  useConsoleTitle('Case Management');
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const casesQuery = useApi<ServerCase[]>(
    () => consoleApi.cases(filter === 'All' ? undefined : filter), [filter]);
  const cases = useMemo(() => casesQuery.data ?? [], [casesQuery.data]);

  const effectiveId = selectedId ?? cases[0]?.id ?? null;
  const detailQuery = useApi<CaseDetail | null>(
    () => (effectiveId ? consoleApi.caseDetail(effectiveId) : Promise.resolve(null)), [effectiveId]);
  const selected = detailQuery.data;

  const { pageItems, page, setPage, totalPages, totalItems } = usePagination(cases, PAGE_SIZE);

  const kpis = [
    { label: 'Open cases', value: String(cases.filter((c) => c.status !== 'Closed').length) },
    { label: 'Escalated', value: String(cases.filter((c) => c.status === 'Escalated').length) },
    { label: 'Investigating', value: String(cases.filter((c) => c.status === 'Investigating').length) },
    { label: 'Closed', value: String(cases.filter((c) => c.status === 'Closed').length) },
  ];

  const changeStatus = async (id: string, status: string) => {
    await consoleApi.patchCase(id, { status }).catch(() => {});
    casesQuery.reload();
    detailQuery.reload();
  };

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 16 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: '18px 20px' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A8593' }}>
              {k.label}
            </div>
            <div style={{ fontFamily: 'Barlow', fontSize: 26, fontWeight: 800, color: '#1D1D1B', marginTop: 6 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 24, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid #E9EDF1', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>Cases</div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
          </div>

          {casesQuery.loading && <div style={{ padding: '28px 22px', fontSize: 13, color: '#7A8593' }}>Loading cases…</div>}
          {casesQuery.error && <div style={{ padding: '28px 22px', fontSize: 13, fontWeight: 600, color: '#D71A28' }}>{casesQuery.error.message}</div>}
          {!casesQuery.loading && cases.length === 0 && (
            <div style={{ padding: '40px 22px', textAlign: 'center', color: '#7A8593' }}>
              <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700, color: '#3E4753' }}>No cases yet</div>
              <div style={{ fontSize: '12.5px', marginTop: 4 }}>Open a case from an alert review to start an investigation record.</div>
            </div>
          )}

          {cases.length > 0 && (
            <>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 640 }}>
                  <div
                    style={{
                      display: 'grid', gridTemplateColumns: '88px minmax(0,1.2fr) minmax(0,1fr) 120px 110px 70px',
                      padding: '10px 22px', fontFamily: 'Barlow', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: '#7A8593', borderBottom: '1px solid #E9EDF1',
                    }}
                  >
                    <div>Case</div><div>Subject</div><div>Threat type</div><div>Status</div><div>Assignee</div><div style={{ textAlign: 'right' }}>Age</div>
                  </div>
                  {pageItems.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      style={{
                        display: 'grid', gridTemplateColumns: '88px minmax(0,1.2fr) minmax(0,1fr) 120px 110px 70px',
                        alignItems: 'center', width: '100%', padding: '14px 22px', border: 'none', borderBottom: '1px solid #F0F2F5',
                        cursor: 'pointer', fontFamily: 'inherit', background: c.id === effectiveId ? '#FBF1F2' : '#fff',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, textAlign: 'left' }}>
                        <span style={{ fontFamily: 'Barlow', fontWeight: 700, fontSize: 13, color: '#D71A28' }}>{c.id}</span>
                        {c.case_type === 'AML' && <Chip color="#7B4B94">AML</Chip>}
                      </div>
                      <div style={{ textAlign: 'left', fontSize: '12.5px', fontWeight: 700, color: '#3E4753' }} title={c.user_ref ?? undefined}>{subjectLabel(c.user_ref, 10)}</div>
                      <div style={{ textAlign: 'left' }}>{c.threat_type ? <Chip color={threatColor(c.threat_type)}>{c.threat_type}</Chip> : <span style={{ fontSize: 12, color: '#7A8593' }}>—</span>}</div>
                      <div style={{ textAlign: 'left' }}><Chip color={statusColors[c.status]}>{c.status}</Chip></div>
                      <div style={{ textAlign: 'left', fontSize: '12.5px', color: '#5A6976' }}>{c.assignee}</div>
                      <div style={{ textAlign: 'right', fontSize: '12.5px', color: '#7A8593' }}>{relAge(c.created_at)}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} onChange={setPage} />
            </>
          )}
        </div>

        {/* CASE DETAIL */}
        <div style={{ background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: 22 }}>
          {!selected ? (
            <div style={{ fontSize: '12.5px', color: '#7A8593' }}>Select a case to see its timeline.</div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700 }}>{selected.id}</div>
                  {selected.case_type === 'AML' && <Chip color="#7B4B94">AML file</Chip>}
                </div>
                <Chip color={statusColors[selected.status]}>{selected.status}</Chip>
              </div>
              <div style={{ fontSize: '12.5px', color: '#7A8593', marginTop: 4 }}>
                {selected.threat_type || 'Unclassified'} · {selected.assignee} · opened {relAge(selected.created_at)} ago
                {selected.case_type === 'AML' && selected.linked_case_id ? ` · derived from ${selected.linked_case_id}` : ''}
                {selected.case_type === 'AML' && !selected.linked_case_id && selected.alert_id ? ` · derived from ${selected.alert_id}` : ''}
              </div>
              <div style={{ marginTop: 16, padding: '14px 16px', background: '#FBF1F2', border: '1px solid #F2D9DB', borderRadius: 4, fontSize: 13, lineHeight: 1.6, color: '#5A6976' }}>
                {selected.summary || 'No summary.'}
              </div>
              {selected.case_type === 'AML' && selected.user_ref && (
                <button
                  type="button"
                  onClick={() => navigate(`/console/graph?subject=${encodeURIComponent(selected.user_ref!)}`)}
                  style={{
                    marginTop: 12, width: '100%', padding: 11, background: '#7B4B94', color: '#fff',
                    border: 'none', borderRadius: 3, fontFamily: 'Barlow', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  View money flow →
                </button>
              )}

              {selected.alerts.length > 0 && (
                <>
                  <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A8593', marginTop: 18 }}>
                    Linked alerts
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {selected.alerts.map((a) => (
                      <span key={a.id} style={{ fontFamily: 'Barlow', fontSize: 12, fontWeight: 700, color: '#D71A28', background: '#FBF1F2', border: '1px solid #F2D9DB', borderRadius: 3, padding: '3px 8px' }}>{a.id}</span>
                    ))}
                  </div>
                </>
              )}

              <div style={{ fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A8593', marginTop: 18 }}>
                Timeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {selected.timeline.map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', marginTop: 3, flexShrink: 0, background: i === selected.timeline.length - 1 ? '#D71A28' : '#C9CED4' }} />
                      {i !== selected.timeline.length - 1 && <span style={{ width: 2, flex: 1, background: '#E9EDF1' }} />}
                    </div>
                    <div style={{ paddingBottom: 14 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{t.event}</div>
                      <div style={{ fontSize: '11.5px', color: '#7A8593', marginTop: 2 }}>{new Date(t.at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => changeStatus(selected.id, 'Escalated')}
                  style={{ flex: 1, padding: 12, background: '#D71A28', color: '#fff', border: 'none', borderRadius: 3, fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Escalate
                </button>
                <button
                  type="button"
                  onClick={() => changeStatus(selected.id, 'Closed')}
                  style={{ flex: 1, padding: 12, background: '#fff', color: '#3E4753', border: '1px solid #E0E5EA', borderRadius: 3, fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Close case
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
