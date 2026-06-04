"use client";

import { useMemo, useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { classifyRifleKdigo } from "@/lib/clinical";

const INPUT =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40 bg-white";

function n(raw: string) {
  const v = Number(raw.replace(",", "."));
  return Number.isNaN(v) || v <= 0 ? null : v;
}

function nAny(raw: string) {
  const v = Number(raw.replace(",", "."));
  return Number.isNaN(v) ? null : v;
}

type Variant = "success" | "warning" | "danger" | "info";

function ResultBox({ value, unit, sub, variant }: { value: string; unit?: string; sub?: string; variant: Variant }) {
  const bg: Record<Variant, string> = {
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    danger: "bg-red-50 border-red-200 text-red-900",
    info: "bg-teal-50 border-teal-200 text-teal-900",
  };
  return (
    <div className={`rounded-xl border p-4 mt-4 ${bg[variant]}`}>
      <p className="text-3xl font-bold tabular-nums">
        {value}
        {unit && <span className="text-base font-semibold ml-1">{unit}</span>}
      </p>
      {sub && <p className="mt-2 text-sm leading-snug">{sub}</p>}
    </div>
  );
}

/* ── RIFLE / KDIGO ──────────────────────────────────────────── */
const RIFLE_COLORS = {
  sin_ira: "bg-green-50 border-green-200 text-green-900",
  estadio1: "bg-yellow-50 border-yellow-200 text-yellow-900",
  estadio2: "bg-orange-50 border-orange-200 text-orange-900",
  estadio3: "bg-red-50 border-red-200 text-red-900",
};

function RifleKdigo() {
  const [baseCr, setBaseCr] = useState("");
  const [actualCr, setActualCr] = useState("");
  const [urineMl, setUrineMl] = useState("");
  const [peso, setPeso] = useState("");

  const result = useMemo(() => {
    const b = n(baseCr);
    const a = n(actualCr);
    if (!b || !a) return null;
    const u = urineMl !== "" ? n(urineMl) ?? undefined : undefined;
    const w = peso !== "" ? n(peso) ?? undefined : undefined;
    return classifyRifleKdigo({ baseCr: b, actualCr: a, urineVolumeMl: u, weightKg: w });
  }, [baseCr, actualCr, urineMl, peso]);

  const ratio =
    n(baseCr) && n(actualCr) ? ((n(actualCr) as number) / (n(baseCr) as number)).toFixed(2) : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">RIFLE / KDIGO — Injuria Renal Aguda</h2>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Creatinina basal (mg/dL)</span>
          <input inputMode="decimal" className={INPUT} value={baseCr} onChange={(e) => setBaseCr(e.target.value)} placeholder="1,0" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Creatinina actual (mg/dL)</span>
          <input inputMode="decimal" className={INPUT} value={actualCr} onChange={(e) => setActualCr(e.target.value)} placeholder="2,5" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Diuresis últimas 6 h (mL) <span className="text-slate-400 font-normal">— opcional</span></span>
          <input inputMode="decimal" className={INPUT} value={urineMl} onChange={(e) => setUrineMl(e.target.value)} placeholder="Ej. 180" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Peso (kg) <span className="text-slate-400 font-normal">— opcional</span></span>
          <input inputMode="decimal" className={INPUT} value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Ej. 70" />
        </label>
      </div>
      {result ? (
        <div className={`rounded-xl border p-4 ${RIFLE_COLORS[result.stage]}`}>
          <p className="text-2xl font-bold">{result.rifle}</p>
          <p className="font-semibold mt-1">{result.kdigo}</p>
          {ratio && <p className="mt-2 text-sm">Ratio creatinina: {ratio}×</p>}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Ingresá creatinina basal y actual para ver el resultado.</p>
      )}
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500 overflow-x-auto">
        <table className="w-full min-w-[360px]">
          <thead>
            <tr className="text-slate-600">
              <th className="text-left pb-1 pr-4">RIFLE</th>
              <th className="text-left pb-1 pr-4">KDIGO</th>
              <th className="text-left pb-1">Criterio Cr</th>
            </tr>
          </thead>
          <tbody>
            {[["Riesgo (R)", "Estadio 1", "× 1,5–2,0"], ["Injuria (I)", "Estadio 2", "× 2,0–3,0"], ["Falla (F)", "Estadio 3", "× ≥ 3,0 o Cr ≥ 4"]].map(([r, k, c]) => (
              <tr key={r}><td className="py-0.5 pr-4">{r}</td><td className="py-0.5 pr-4">{k}</td><td className="py-0.5">{c}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── ANION GAP ──────────────────────────────────────────────── */
function AnionGap() {
  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [hco3, setHco3] = useState("");

  const result = useMemo(() => {
    const vNa = nAny(na); const vCl = nAny(cl); const vHco3 = nAny(hco3);
    if (vNa === null || vCl === null || vHco3 === null) return null;
    return vNa - (vCl + vHco3);
  }, [na, cl, hco3]);

  const { sub, variant }: { sub: string; variant: Variant } =
    result === null ? { sub: "", variant: "info" }
    : result >= 16 ? { sub: "Anion gap ELEVADO. Considerar: cetoacidosis, acidosis láctica, IRA, intoxicaciones (metanol, etilenglicol, salicilatos).", variant: "danger" }
    : result >= 12 ? { sub: "Límite superior. Corregir por albúmina: AG corregido = AG + 2,5 × (4 – albúmina g/dL).", variant: "warning" }
    : { sub: "Anion gap normal (8–12 mEq/L).", variant: "success" };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Anion Gap</h2>
      <p className="text-xs text-slate-500">AG = Na⁺ − (Cl⁻ + HCO₃⁻) · Normal: 8–12 mEq/L</p>
      <div className="grid grid-cols-3 gap-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Na⁺ (mEq/L)</span>
          <input inputMode="decimal" className={INPUT} value={na} onChange={(e) => setNa(e.target.value)} placeholder="140" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Cl⁻ (mEq/L)</span>
          <input inputMode="decimal" className={INPUT} value={cl} onChange={(e) => setCl(e.target.value)} placeholder="100" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">HCO₃⁻ (mEq/L)</span>
          <input inputMode="decimal" className={INPUT} value={hco3} onChange={(e) => setHco3(e.target.value)} placeholder="22" />
        </label>
      </div>
      {result !== null ? (
        <ResultBox value={result.toFixed(1)} unit="mEq/L" sub={sub} variant={variant} />
      ) : (
        <p className="text-sm text-slate-500">Ingresá Na⁺, Cl⁻ y HCO₃⁻ para ver el resultado.</p>
      )}
    </div>
  );
}

/* ── OSMOLARIDAD ─────────────────────────────────────────────── */
function Osmolaridad() {
  const [na, setNa] = useState("");
  const [glu, setGlu] = useState("");
  const [urea, setUrea] = useState("");

  const result = useMemo(() => {
    const vNa = nAny(na); const vGlu = nAny(glu); const vUrea = nAny(urea);
    if (vNa === null || vGlu === null || vUrea === null) return null;
    return 2 * vNa + vGlu / 18 + vUrea / 2.8;
  }, [na, glu, urea]);

  const { sub, variant }: { sub: string; variant: Variant } =
    result === null ? { sub: "", variant: "info" }
    : result > 320 ? { sub: "Hiperosmolaridad (> 320 mOsm/L). Evaluar causa.", variant: "danger" }
    : result < 275 ? { sub: "Hiposmolaridad (< 275 mOsm/L). Evaluar causa.", variant: "warning" }
    : { sub: "Osmolaridad normal (275–295 mOsm/L).", variant: "success" };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Osmolaridad Plasmática</h2>
      <p className="text-xs text-slate-500">Osm = 2 × Na⁺ + Glucosa/18 + Urea/2,8 · Normal: 275–295 mOsm/L</p>
      <div className="grid grid-cols-3 gap-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Na⁺ (mEq/L)</span>
          <input inputMode="decimal" className={INPUT} value={na} onChange={(e) => setNa(e.target.value)} placeholder="140" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Glucosa (mg/dL)</span>
          <input inputMode="decimal" className={INPUT} value={glu} onChange={(e) => setGlu(e.target.value)} placeholder="100" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Urea (mg/dL)</span>
          <input inputMode="decimal" className={INPUT} value={urea} onChange={(e) => setUrea(e.target.value)} placeholder="30" />
        </label>
      </div>
      {result !== null ? (
        <ResultBox value={result.toFixed(1)} unit="mOsm/L" sub={sub} variant={variant} />
      ) : (
        <p className="text-sm text-slate-500">Ingresá Na⁺, Glucosa y Urea para ver el resultado.</p>
      )}
    </div>
  );
}

/* ── GRADIENTE A-a ───────────────────────────────────────────── */
function GradienteAA() {
  const [pao2, setPao2] = useState("");
  const [paco2, setPaco2] = useState("");
  const [fio2, setFio2] = useState("21");
  const [patm, setPatm] = useState("760");

  const result = useMemo(() => {
    const vPao2 = n(pao2); const vPaco2 = n(paco2);
    const vFio2 = n(fio2); const vPatm = n(patm);
    if (!vPao2 || !vPaco2 || !vFio2 || !vPatm) return null;
    const pio2 = (vFio2 / 100) * (vPatm - 47);
    const pao2ideal = pio2 - vPaco2 / 0.8;
    return pao2ideal - vPao2;
  }, [pao2, paco2, fio2, patm]);

  const { sub, variant }: { sub: string; variant: Variant } =
    result === null ? { sub: "", variant: "info" }
    : result < 0 ? { sub: "Valor negativo — verificar los datos ingresados.", variant: "danger" }
    : result < 15 ? { sub: "Gradiente A-a normal (< 15 mmHg). Sin alteración del intercambio gaseoso.", variant: "success" }
    : result < 30 ? { sub: "Gradiente A-a levemente elevado (15–30 mmHg). Monitorizar.", variant: "warning" }
    : { sub: "Gradiente A-a elevado (> 30 mmHg). Considerar shunt intrapulmonar, V/Q alterada, alteración de difusión.", variant: "danger" };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Gradiente Alveolo-Arterial (A-a)</h2>
      <p className="text-xs text-slate-500">A-a = [(FiO₂/100) × (Patm − 47) − PaCO₂/0,8] − PaO₂ · Normal: &lt; 15 mmHg (aire ambiente)</p>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">PaO₂ (mmHg)</span>
          <input inputMode="decimal" className={INPUT} value={pao2} onChange={(e) => setPao2(e.target.value)} placeholder="80" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">PaCO₂ (mmHg)</span>
          <input inputMode="decimal" className={INPUT} value={paco2} onChange={(e) => setPaco2(e.target.value)} placeholder="40" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">FiO₂ (%)</span>
          <input inputMode="decimal" className={INPUT} value={fio2} onChange={(e) => setFio2(e.target.value)} placeholder="21" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">P atm (mmHg)</span>
          <input inputMode="decimal" className={INPUT} value={patm} onChange={(e) => setPatm(e.target.value)} placeholder="760" />
        </label>
      </div>
      {result !== null ? (
        <ResultBox value={result.toFixed(1)} unit="mmHg" sub={sub} variant={variant} />
      ) : (
        <p className="text-sm text-slate-500">Completá los campos para ver el resultado.</p>
      )}
    </div>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────── */
export default function NefrologiaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nefrología</h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          RIFLE/KDIGO · Anion gap · Osmolaridad · Gradiente A-a
        </p>
      </div>
      <RifleKdigo />
      <AnionGap />
      <Osmolaridad />
      <GradienteAA />
      <MedicalDisclaimer />
    </div>
  );
}
