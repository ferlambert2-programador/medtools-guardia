"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

function SexToggle({ female, onChange }: { female: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      {[{ label: "Masculino", val: false }, { label: "Femenino", val: true }].map(({ label, val }) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(val)}
          className={`flex-1 py-2 rounded-lg border text-sm transition-colors ${
            female === val
              ? "bg-teal-600 text-white border-teal-600 font-semibold"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ── PESO IDEAL (BROCA) ─────────────────────────────────────── */
function PesoIdeal() {
  const [altura, setAltura] = useState("");
  const [female, setFemale] = useState(false);

  const pi = useMemo(() => {
    const h = n(altura);
    if (!h) return null;
    return female ? (h - 100) * 0.85 : (h - 100) * 0.9;
  }, [altura, female]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Peso Ideal — Broca modificada</h2>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Altura (cm)</span>
        <input
          inputMode="decimal"
          className={INPUT}
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Ej. 170"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Sexo</span>
        <SexToggle female={female} onChange={setFemale} />
      </label>
      {pi !== null ? (
        <ResultBox
          value={pi.toFixed(1)}
          unit="kg"
          sub={`Fórmula: (altura – 100) × ${female ? "0,85" : "0,90"} para ${female ? "mujeres" : "varones"}`}
          variant="info"
        />
      ) : (
        <p className="text-sm text-slate-500">Ingresá la altura para ver el resultado.</p>
      )}
    </div>
  );
}

/* ── HARRIS-BENEDICT ───────────────────────────────────────── */
const ACTIVITY_FACTORS = [
  { value: "1.2", label: "Sedentario (× 1,2)" },
  { value: "1.375", label: "Actividad ligera (× 1,375)" },
  { value: "1.55", label: "Actividad moderada (× 1,55)" },
  { value: "1.725", label: "Actividad intensa (× 1,725)" },
  { value: "1.9", label: "Actividad muy intensa (× 1,9)" },
];

function HarrisBenedict() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [edad, setEdad] = useState("");
  const [female, setFemale] = useState(false);
  const [factor, setFactor] = useState("1.2");

  const result = useMemo(() => {
    const w = n(peso);
    const h = n(altura);
    const a = n(edad);
    if (!w || !h || !a) return null;
    const geb = female
      ? 655.1 + 9.563 * w + 1.85 * h - 4.676 * a
      : 66.5 + 13.75 * w + 5.003 * h - 6.775 * a;
    const get = geb * Number(factor);
    return { geb: Math.round(geb), get: Math.round(get) };
  }, [peso, altura, edad, female, factor]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Gasto Energético — Harris-Benedict</h2>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Peso (kg)</span>
          <input inputMode="decimal" className={INPUT} value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Ej. 70" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Altura (cm)</span>
          <input inputMode="decimal" className={INPUT} value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="Ej. 170" />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Edad (años)</span>
        <input inputMode="numeric" className={INPUT} value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="Ej. 35" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Sexo</span>
        <SexToggle female={female} onChange={setFemale} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Factor de actividad</span>
        <select className={INPUT} value={factor} onChange={(e) => setFactor(e.target.value)}>
          {ACTIVITY_FACTORS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      {result ? (
        <ResultBox
          value={result.get.toLocaleString("es-AR")}
          unit="kcal/día"
          sub={`GEB (metabolismo basal): ${result.geb.toLocaleString("es-AR")} kcal/día · Factor: × ${factor}`}
          variant="info"
        />
      ) : (
        <p className="text-sm text-slate-500">Completá todos los campos para ver el resultado.</p>
      )}
    </div>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────── */
export default function NutricionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nutrición</h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Peso ideal · Gasto energético (Harris-Benedict)
        </p>
      </div>
      <div className="rounded-xl border border-teal-100 bg-teal-50/80 px-4 py-3 text-sm text-teal-800">
        ¿Necesitás calcular el IMC?{" "}
        <Link href="/imc" className="font-semibold underline underline-offset-2">
          Ir a la calculadora de IMC →
        </Link>
      </div>
      <PesoIdeal />
      <HarrisBenedict />
      <MedicalDisclaimer />
    </div>
  );
}
