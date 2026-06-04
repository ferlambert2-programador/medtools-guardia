"use client";

import { useMemo, useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

const INPUT =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40 bg-white";

function n(raw: string) {
  const v = Number(raw.replace(",", "."));
  return Number.isNaN(v) || v <= 0 ? null : v;
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

function RadioYesNo({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      {["Sí", "No"].map((opt) => {
        const v = opt === "Sí" ? "1" : "0";
        return (
          <label
            key={opt}
            className={`flex-1 py-2 rounded-lg border text-sm text-center cursor-pointer transition-colors ${
              value === v
                ? "bg-teal-600 text-white border-teal-600 font-semibold"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="sr-only" />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

/* ── P/F ─────────────────────────────────────────────────────── */
function PFRatio() {
  const [pao2, setPao2] = useState("");
  const [fio2, setFio2] = useState("");

  const pf = useMemo(() => {
    const p = n(pao2);
    const f = n(fio2);
    if (!p || !f) return null;
    return p / (f / 100);
  }, [pao2, fio2]);

  const { label, variant }: { label: string; variant: Variant } =
    pf === null ? { label: "", variant: "info" }
    : pf >= 300 ? { label: "Normal (sin SDRA)", variant: "success" }
    : pf >= 200 ? { label: "SDRA leve (Berlín: 200–300)", variant: "warning" }
    : pf >= 100 ? { label: "SDRA moderado (Berlín: 100–200)", variant: "danger" }
    : { label: "SDRA grave (Berlín: < 100)", variant: "danger" };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Relación PaO₂/FiO₂</h2>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">PaO₂ (mmHg)</span>
          <input inputMode="decimal" className={INPUT} value={pao2} onChange={(e) => setPao2(e.target.value)} placeholder="Ej. 80" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">FiO₂ (%)</span>
          <input inputMode="decimal" className={INPUT} value={fio2} onChange={(e) => setFio2(e.target.value)} placeholder="Ej. 40" />
        </label>
      </div>
      {pf !== null ? (
        <ResultBox value={Math.round(pf).toString()} variant={variant} sub={label} />
      ) : (
        <p className="text-sm text-slate-500">Ingresá PaO₂ y FiO₂ para ver el resultado.</p>
      )}
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-600 mb-1">Criterios de Berlín (PEEP ≥ 5 cmH₂O)</p>
        <table className="w-full">
          <tbody>
            {[["Leve", "200–300 mmHg"], ["Moderado", "100–200 mmHg"], ["Grave", "< 100 mmHg"]].map(([cat, range]) => (
              <tr key={cat}><td className="py-0.5 pr-4 font-medium">{cat}</td><td>{range}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── BERLÍN SDRA ─────────────────────────────────────────────── */
function BerlinSdra() {
  const [tiempo, setTiempo] = useState("1");
  const [rx, setRx] = useState("1");
  const [edemaCardio, setEdemaCardio] = useState("1");
  const [pfRaw, setPfRaw] = useState("");
  const [peep, setPeep] = useState("1");

  const pf = n(pfRaw);
  const prerequisitesMet = tiempo === "1" && rx === "1" && edemaCardio === "1" && peep === "1";

  let result: { value: string; sub: string; variant: Variant } | null = null;

  if (!prerequisitesMet) {
    result = {
      value: "No cumple criterios de Berlín",
      sub: "Requiere: inicio < 1 semana, opacidades bilaterales, edema cardiogénico excluido y PEEP ≥ 5 cmH₂O.",
      variant: "info",
    };
  } else if (pf !== null) {
    if (pf > 300) {
      result = { value: "Sin SDRA", sub: `P/F = ${Math.round(pf)} mmHg > 300. No cumple criterio gasométrico.`, variant: "success" };
    } else if (pf >= 200) {
      result = { value: "SDRA Leve", sub: `P/F = ${Math.round(pf)} mmHg (200–300). Mortalidad ~27%.`, variant: "warning" };
    } else if (pf >= 100) {
      result = { value: "SDRA Moderado", sub: `P/F = ${Math.round(pf)} mmHg (100–200). Mortalidad ~32%.`, variant: "danger" };
    } else {
      result = { value: "SDRA Grave", sub: `P/F = ${Math.round(pf)} mmHg (< 100). Mortalidad ~45%.`, variant: "danger" };
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Criterios de Berlín — SDRA</h2>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Inicio agudo ({"<"} 1 semana del insulto conocido)</span>
        <RadioYesNo name="berlin-tiempo" value={tiempo} onChange={setTiempo} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Opacidades bilaterales en RX o TC de tórax</span>
        <RadioYesNo name="berlin-rx" value={rx} onChange={setRx} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Edema cardiogénico excluido como causa principal</span>
        <RadioYesNo name="berlin-ec" value={edemaCardio} onChange={setEdemaCardio} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">PEEP ≥ 5 cmH₂O</span>
        <RadioYesNo name="berlin-peep" value={peep} onChange={setPeep} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">PaO₂/FiO₂ (mmHg)</span>
        <input inputMode="decimal" className={INPUT} value={pfRaw} onChange={(e) => setPfRaw(e.target.value)} placeholder="Ej. 150" />
      </label>
      {result ? (
        <ResultBox value={result.value} sub={result.sub} variant={result.variant} />
      ) : (
        <p className="text-sm text-slate-500">Completá todos los campos para ver el resultado.</p>
      )}
    </div>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────── */
export default function RespiratorioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Respiratorio</h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Relación PaO₂/FiO₂ · Criterios de Berlín (SDRA)
        </p>
      </div>
      <PFRatio />
      <BerlinSdra />
      <MedicalDisclaimer />
    </div>
  );
}
