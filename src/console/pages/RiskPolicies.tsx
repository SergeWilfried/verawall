import { useEffect, useRef, useState } from 'react';
import { consoleApi, type TenantSettings } from '../api';
import { useApi } from '../useApi';
import { useAuth } from '../auth';
import { useConsoleTitle } from '../TitleContext';
import { SkeletonLines } from '../components/Skeleton';
import { appetites, verticals, scaleHighAmount, type RiskAppetite, type RiskVertical } from '../../data/console/riskPresets';
import { MicrofinanceArt, WalletArt, RidesharingArt, BankArt, ConservativeArt, BalancedArt, GrowthArt } from '../components/riskArt';

const verticalArt: Record<string, React.ReactNode> = {
  microfinance: <MicrofinanceArt />, wallet: <WalletArt />,
  ridesharing: <RidesharingArt />, bank: <BankArt />,
};
const appetiteArt: Record<string, React.ReactNode> = {
  conservative: <ConservativeArt />, balanced: <BalancedArt />, aggressive: <GrowthArt />,
};

// Risk Policies — the appetite dial, in business language first.
//
// First run is a three-step wizard (vertical → appetite → review the actual
// numbers), because the raw knobs ask admins questions they can't answer
// ("velocity slope: 15?"). After setup the page shows the applied profile
// and its effective values; Advanced discloses the manual inputs, and any
// hand edit marks the profile "Custom — based on <vertical>". The server
// enforces band sanity and every apply lands in the audit trail.

const card: React.CSSProperties = { background: '#fff', border: '1px solid #E3E7EB', borderRadius: 6, padding: '22px 24px' };
const label: React.CSSProperties = { fontFamily: 'Barlow', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A8593' };
const numInput: React.CSSProperties = {
  fontWeight: 700, textAlign: 'right', fontFamily: "'Open Sans', sans-serif", fontSize: '12.5px',
  color: '#1E262E', border: '1px solid #E3E7EB', borderRadius: 3, padding: '6px 10px', width: 110,
  fontVariantNumeric: 'tabular-nums',
};

function OptionCard({ selected, onSelect, title, desc, extra, art }: {
  selected: boolean; onSelect: () => void; title: string; desc: string; extra?: string; art?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="press-scale"
      style={{
        textAlign: 'left', background: selected ? '#FBF1F2' : '#fff', cursor: 'pointer',
        border: `1px solid ${selected ? '#D71A28' : '#E3E7EB'}`, borderRadius: 6, padding: '18px 20px',
        transition: 'border-color .15s, background-color .15s, transform .15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {art && <div style={{ flexShrink: 0 }}>{art}</div>}
        <div style={{ fontFamily: 'Barlow', fontSize: 15, fontWeight: 700, color: selected ? '#D71A28' : '#1E262E' }}>{title}</div>
      </div>
      <div style={{ fontSize: '12.5px', color: '#5A6976', marginTop: 8, lineHeight: 1.55 }}>{desc}</div>
      {extra && <div style={{ fontSize: 12, color: '#7A8593', marginTop: 8, lineHeight: 1.5, fontStyle: 'italic' }}>{extra}</div>}
    </button>
  );
}

export function RiskPolicies() {
  useConsoleTitle('Risk Policies');
  const { session } = useAuth();
  const isAdmin = session?.role === 'Admin';

  const settingsQuery = useApi<TenantSettings>(() => consoleApi.settings(), []);
  const [draft, setDraft] = useState<TenantSettings | null>(null);
  useEffect(() => {
    if (settingsQuery.data && !draft) setDraft(structuredClone(settingsQuery.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsQuery.data]);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [wizard, setWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [vertical, setVertical] = useState<RiskVertical | null>(null);
  const [appetite, setAppetite] = useState<RiskAppetite | null>(null);
  const [advanced, setAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  // The wizard is a native <dialog>: modal focus trap, Escape-to-close and
  // backdrop come from the platform instead of a homegrown overlay.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (wizard && !dlg.open) dlg.showModal();
    if (!wizard && dlg.open) dlg.close();
  }, [wizard, draft]);
  // First run: open the wizard as soon as settings arrive with no profile.
  useEffect(() => {
    if (draft && !draft.riskProfile) setWizard(true);
  }, [draft]);

  if (!draft) {
    return <div style={{ padding: 28 }}><div style={card}><SkeletonLines n={6} gap={16} /></div></div>;
  }

  const profile = draft.riskProfile;
  const bands = draft.risk?.bands ?? { stepUp: 55, hold: 85 };
  const velocity = draft.risk?.velocity ?? { windowMin: 10, threshold: 4, baseWeight: 20, slope: 15 };
  const highAmount = draft.risk?.highAmount ?? { DEFAULT: 500000 };

  async function persist(patch: Partial<TenantSettings>, msg: string) {
    setSaving(true);
    try {
      const updated = await consoleApi.patchSettings(patch);
      setDraft(structuredClone(updated));
      setSavedMsg(msg);
      setTimeout(() => setSavedMsg(''), 4000);
    } finally {
      setSaving(false);
    }
  }

  async function applyPreset() {
    if (!vertical || !appetite) return;
    await persist({
      risk: {
        bands: appetite.bands,
        velocity: vertical.velocity,
        highAmount: scaleHighAmount(highAmount, appetite.highAmountFactor),
      },
      riskProfile: {
        vertical: vertical.key, appetite: appetite.key,
        appliedAt: new Date().toISOString(), custom: false,
      },
    } as Partial<TenantSettings>, `Applied ${vertical.label} · ${appetite.label}`);
    setWizard(false); setStep(1);
  }

  async function saveManual() {
    await persist({
      risk: { bands, velocity, highAmount },
      ...(profile ? { riskProfile: { ...profile, custom: true } } : {}),
    } as Partial<TenantSettings>, 'Manual thresholds saved');
  }

  const set = (fn: (d: TenantSettings) => void) => {
    const next = structuredClone(draft);
    fn(next);
    setDraft(next);
  };

  const verticalOf = (key?: string) => verticals.find((v) => v.key === key);
  const appetiteOf = (key?: string) => appetites.find((a) => a.key === key);

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 980 }}>
      <div>
        <div style={{ fontFamily: 'Barlow', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D71A28' }}>
          Administration
        </div>
        <p style={{ fontSize: '13.5px', color: '#5A6976', marginTop: 6, maxWidth: 640, lineHeight: 1.6 }}>
          When payments are challenged and when they are held — set from your business profile,
          tuned by hand when you need to. Every change is recorded in the audit log.
        </p>
      </div>
      {savedMsg && (
        <div style={{ padding: '10px 16px', background: '#F0F9F1', border: '1px solid #BFE3C6', borderRadius: 6, fontSize: 13, color: '#1E7A34', fontWeight: 600 }}>
          {savedMsg}
        </div>
      )}
      {!isAdmin && (
        <div style={{ fontSize: '11.5px', color: '#7A8593' }}>Read-only — only tenant admins can change risk policies.</div>
      )}

      <dialog
        ref={dialogRef}
        className="vw-dialog"
        onClose={() => setWizard(false)}
        onCancel={() => setWizard(false)}
      >
        <div style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'Barlow', fontSize: 16, fontWeight: 700 }}>
              {step === 1 && 'What kind of organisation is this?'}
              {step === 2 && 'How much risk do you accept?'}
              {step === 3 && 'Review — these values will be applied'}
            </div>
            <div style={{ ...label, fontVariantNumeric: 'tabular-nums' }}>Step {step} of 3</div>
          </div>

          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 18 }}>
              {verticals.map((v) => (
                <OptionCard key={v.key} selected={vertical?.key === v.key} onSelect={() => setVertical(v)}
                  title={v.label} desc={v.desc} extra={v.focus} art={verticalArt[v.key]} />
              ))}
            </div>
          )}
          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 18 }}>
              {appetites.map((a) => (
                <OptionCard key={a.key} selected={appetite?.key === a.key} onSelect={() => setAppetite(a)}
                  title={a.label} desc={a.consequence} art={appetiteArt[a.key]} />
              ))}
            </div>
          )}
          {step === 3 && vertical && appetite && (
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: '12.5px', color: '#5A6976', lineHeight: 1.6 }}>
                <b>{vertical.label}</b> · <b>{appetite.label}</b> — a starting point, not a lock-in:
                every value stays editable under Advanced afterwards.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div style={{ border: '1px solid #E9EDF1', borderRadius: 6, padding: '14px 16px' }}>
                  <div style={label}>Policy bands</div>
                  <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.7, fontVariantNumeric: 'tabular-nums' }}>
                    Step-up from score <b>{appetite.bands.stepUp}</b><br />Hold from score <b>{appetite.bands.hold}</b>
                  </div>
                </div>
                <div style={{ border: '1px solid #E9EDF1', borderRadius: 6, padding: '14px 16px' }}>
                  <div style={label}>Transfer velocity</div>
                  <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.7, fontVariantNumeric: 'tabular-nums' }}>
                    Fires at <b>{vertical.velocity.threshold}</b> transfers / <b>{vertical.velocity.windowMin} min</b><br />
                    Weight <b>{vertical.velocity.baseWeight}</b> + <b>{vertical.velocity.slope}</b> per extra
                  </div>
                </div>
                <div style={{ border: '1px solid #E9EDF1', borderRadius: 6, padding: '14px 16px' }}>
                  <div style={label}>High-amount cutoffs</div>
                  <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.7, fontVariantNumeric: 'tabular-nums' }}>
                    {Object.entries(scaleHighAmount(highAmount, appetite.highAmountFactor)).slice(0, 3)
                      .map(([c, v]) => <span key={c}>{c}: <b>{v.toLocaleString()}</b><br /></span>)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
            <button type="button" className="press-scale" disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              style={{ padding: '10px 18px', borderRadius: 3, border: '1px solid #E0E5EA', background: '#fff', color: step === 1 ? '#C9CED4' : '#5A6976', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: step === 1 ? 'default' : 'pointer', transition: 'color .15s, transform .15s' }}>
              ← Back
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              {(
                <button type="button" className="press-scale" onClick={() => { setWizard(false); setStep(1); }}
                  style={{ padding: '10px 18px', borderRadius: 3, border: '1px solid #E0E5EA', background: '#fff', color: '#5A6976', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color .15s, transform .15s' }}>
                  Cancel
                </button>
              )}
              {step < 3 ? (
                <button type="button" className="press-scale"
                  disabled={(step === 1 && !vertical) || (step === 2 && !appetite)}
                  onClick={() => setStep((s) => s + 1)}
                  style={{ padding: '10px 20px', borderRadius: 3, border: 'none', background: (step === 1 && !vertical) || (step === 2 && !appetite) ? '#E9AEB2' : '#D71A28', color: '#fff', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color .15s, transform .15s' }}>
                  Continue →
                </button>
              ) : (
                <button type="button" className="press-scale" disabled={!isAdmin || saving} onClick={() => void applyPreset()}
                  style={{ padding: '10px 20px', borderRadius: 3, border: 'none', background: isAdmin ? '#D71A28' : '#E9AEB2', color: '#fff', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: isAdmin ? 'pointer' : 'default', transition: 'background-color .15s, transform .15s' }}>
                  {saving ? 'Applying…' : 'Apply profile'}
                </button>
              )}
            </div>
          </div>
        </div>
      </dialog>

      {!profile ? (
        <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontFamily: 'Barlow', fontSize: 17, fontWeight: 700 }}>Set up your risk profile</div>
            <div style={{ fontSize: '12.5px', color: '#5A6976', marginTop: 6, maxWidth: 480, lineHeight: 1.55 }}>
              Pick your organisation type and risk appetite — three steps, and every value stays
              editable afterwards. Until then the platform defaults apply (step-up 55, hold 85).
            </div>
          </div>
          <button type="button" className="press-scale" disabled={!isAdmin} onClick={() => { setWizard(true); setStep(1); }}
            style={{ padding: '12px 22px', borderRadius: 3, border: 'none', background: isAdmin ? '#D71A28' : '#E9AEB2', color: '#fff', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: isAdmin ? 'pointer' : 'default', transition: 'background-color .15s, transform .15s' }}>
            Start setup
          </button>
        </div>
      ) : (
        <>
          <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div style={label}>Active profile</div>
              <div style={{ fontFamily: 'Barlow', fontSize: 19, fontWeight: 700, marginTop: 6 }}>
                {verticalOf(profile?.vertical)?.label ?? profile?.vertical}
                {' · '}{appetiteOf(profile?.appetite)?.label ?? profile?.appetite}
                {profile?.custom && <span style={{ fontSize: 13, color: '#E67E22', marginLeft: 10 }}>Custom — hand-tuned</span>}
              </div>
              <div style={{ fontSize: 12, color: '#7A8593', marginTop: 4 }}>
                Applied {profile ? new Date(profile.appliedAt).toLocaleString() : '—'}
              </div>
            </div>
            <button type="button" className="press-scale" disabled={!isAdmin} onClick={() => { setWizard(true); setStep(1); }}
              style={{ padding: '10px 18px', borderRadius: 3, border: '1px solid #E0E5EA', background: '#fff', color: isAdmin ? '#5A6976' : '#C9CED4', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: isAdmin ? 'pointer' : 'default', transition: 'color .15s, transform .15s' }}>
              Change profile
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <div style={card}>
              <div style={label}>Policy bands</div>
              <div style={{ fontSize: 13.5, marginTop: 10, lineHeight: 1.8, fontVariantNumeric: 'tabular-nums' }}>
                Payments scoring <b>{bands.hold}+</b> are held for review.<br />
                Scores <b>{bands.stepUp}–{bands.hold - 1}</b> challenge the customer first.
              </div>
            </div>
            <div style={card}>
              <div style={label}>Transfer velocity</div>
              <div style={{ fontSize: 13.5, marginTop: 10, lineHeight: 1.8, fontVariantNumeric: 'tabular-nums' }}>
                <b>{velocity.threshold}</b> transfers within <b>{velocity.windowMin} min</b> raise the score by{' '}
                <b>{velocity.baseWeight}</b>, +<b>{velocity.slope}</b> per extra transfer.
              </div>
            </div>
            <div style={card}>
              <div style={label}>High-amount cutoffs</div>
              <div style={{ fontSize: 13.5, marginTop: 10, lineHeight: 1.8, fontVariantNumeric: 'tabular-nums' }}>
                {Object.entries(highAmount).slice(0, 3).map(([c, v]) => (
                  <span key={c}>{c}: <b>{v.toLocaleString()}</b><br /></span>
                ))}
              </div>
            </div>
          </div>

          <div style={card}>
            <button type="button" onClick={() => setAdvanced((a) => !a)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Barlow', fontSize: 14, fontWeight: 700, color: '#1E262E' }}>
              {advanced ? '▾' : '▸'} Advanced — manual thresholds
            </button>
            {advanced && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#7A8593' }}>
                    Step-up from score
                    <input type="number" min={1} max={99} value={bands.stepUp} disabled={!isAdmin} style={numInput}
                      onChange={(e) => set((d) => { d.risk = { ...d.risk!, bands: { ...bands, stepUp: Number(e.target.value) } }; })} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#7A8593' }}>
                    Hold from score
                    <input type="number" min={2} max={100} value={bands.hold} disabled={!isAdmin} style={numInput}
                      onChange={(e) => set((d) => { d.risk = { ...d.risk!, bands: { ...bands, hold: Number(e.target.value) } }; })} />
                  </label>
                </div>
                {bands.hold <= bands.stepUp && (
                  <div style={{ fontSize: 12, color: '#D71A28', fontWeight: 600 }}>
                    Hold must be above step-up — the server rejects this ordering and keeps its defaults.
                  </div>
                )}
                <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                  {([['windowMin', 'Window (min)'], ['threshold', 'Transfers to fire'], ['baseWeight', 'Base weight'], ['slope', 'Weight per extra']] as const).map(([k, lbl]) => (
                    <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#7A8593' }}>
                      {lbl}
                      <input type="number" min={1} value={velocity[k]} disabled={!isAdmin} style={numInput}
                        onChange={(e) => set((d) => { d.risk = { ...d.risk!, velocity: { ...velocity, [k]: Number(e.target.value) } }; })} />
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                  {Object.entries(highAmount).slice(0, 4).map(([ccy]) => (
                    <label key={ccy} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#7A8593' }}>
                      High amount ({ccy})
                      <input type="number" min={0} value={draft.risk?.highAmount?.[ccy] ?? 0} disabled={!isAdmin} style={numInput}
                        onChange={(e) => set((d) => { d.risk = { ...d.risk!, highAmount: { ...d.risk!.highAmount, [ccy]: Number(e.target.value) } }; })} />
                    </label>
                  ))}
                </div>
                <div>
                  <button type="button" className="press-scale" disabled={!isAdmin || saving || bands.hold <= bands.stepUp}
                    onClick={() => void saveManual()}
                    style={{ padding: '10px 20px', borderRadius: 3, border: 'none', background: isAdmin && bands.hold > bands.stepUp ? '#D71A28' : '#E9AEB2', color: '#fff', fontFamily: 'Barlow', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color .15s, transform .15s' }}>
                    {saving ? 'Saving…' : 'Save thresholds'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
