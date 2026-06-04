"use client";

import { useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

type Variant = "success" | "warning" | "danger" | "info";

function ResultBox({ value, sub, variant }: { value: string; sub: string; variant: Variant }) {
  const bg: Record<Variant, string> = {
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    danger: "bg-red-50 border-red-200 text-red-900",
    info: "bg-teal-50 border-teal-200 text-teal-900",
  };
  return (
    <div className={`rounded-xl border p-4 mt-4 ${bg[variant]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm leading-snug">{sub}</p>
    </div>
  );
}

function RadioYesNo({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
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
            <input
              type="radio"
              name={name}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
              className="sr-only"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

/* ── CURB-65 ────────────────────────────────────────────────── */
function Curb65() {
  const [conf, setConf] = useState("0");
  const [urea, setUrea] = useState("0");
  const [fr, setFr] = useState("0");
  const [pa, setPa] = useState("0");
  const [edad, setEdad] = useState("0");

  const score = Number(conf) + Number(urea) + Number(fr) + Number(pa) + Number(edad);

  const { sub, variant }: { sub: string; variant: Variant } =
    score === 0
      ? { sub: "Mortalidad ~1%. Tratamiento ambulatorio posible.", variant: "success" }
      : score === 1
      ? { sub: "Mortalidad ~3%. Internación breve o seguimiento estrecho.", variant: "success" }
      : score === 2
      ? { sub: "Mortalidad ~9%. Internación recomendada.", variant: "warning" }
      : score === 3
      ? { sub: "Mortalidad ~22%. Internación. Considerar UCI.", variant: "danger" }
      : { sub: "Mortalidad ~33%. Internación en UCI.", variant: "danger" };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">CURB-65 — Neumonía</h2>
      {[
        { label: "Confusión reciente", val: conf, set: setConf, name: "curb-conf" },
        { label: "Urea > 7 mmol/L  o  BUN > 20 mg/dL", val: urea, set: setUrea, name: "curb-urea" },
        { label: "FR ≥ 30 rpm", val: fr, set: setFr, name: "curb-fr" },
        { label: "PAS < 90 o PAD ≤ 60 mmHg", val: pa, set: setPa, name: "curb-pa" },
        { label: "Edad ≥ 65 años", val: edad, set: setEdad, name: "curb-edad" },
      ].map(({ label, val, set, name }) => (
        <label key={name} className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <RadioYesNo name={name} value={val} onChange={set} />
        </label>
      ))}
      <ResultBox value={`${score}/5`} sub={sub} variant={variant} />
    </div>
  );
}

/* ── SEPSIS-3 ───────────────────────────────────────────────── */
const INPUT =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40 bg-white";

function Sepsis3() {
  const [infeccion, setInfeccion] = useState("0");
  const [sofaRaw, setSofaRaw] = useState("");

  const sofa = Number(sofaRaw.replace(",", "."));
  const sofaOk = sofaRaw !== "" && !Number.isNaN(sofa) && sofa >= 0;

  let result: { value: string; sub: string; variant: Variant } | null = null;

  if (infeccion === "0") {
    result = {
      value: "Sin infección",
      sub: "Sin sospecha de infección: no aplica criterio Sepsis-3.",
      variant: "info",
    };
  } else if (sofaOk) {
    if (sofa >= 2) {
      result = {
        value: "SEPSIS",
        sub: `SOFA ${sofa} + infección sospechada/confirmada. Iniciar bundle de sepsis. Si hipotensión refractaria + lactato ≥ 2 mmol/L → Shock Séptico.`,
        variant: "danger",
      };
    } else {
      result = {
        value: "Infección sin sepsis",
        sub: `SOFA ${sofa} < 2. No cumple criterios de sepsis por SOFA. Monitorizar evolución.`,
        variant: "warning",
      };
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Sepsis-3</h2>
      <p className="text-sm text-slate-500">
        Sepsis = infección + disfunción orgánica (SOFA ≥ 2 sobre el basal).
        Calculá el SOFA en la sección Scores UCI.
      </p>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">
          ¿Infección sospechada o confirmada?
        </span>
        <RadioYesNo name="sepsis-inf" value={infeccion} onChange={setInfeccion} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Score SOFA calculado</span>
        <input
          inputMode="numeric"
          className={INPUT}
          value={sofaRaw}
          onChange={(e) => setSofaRaw(e.target.value)}
          placeholder="Ej. 4"
        />
      </label>
      {result && (
        <ResultBox value={result.value} sub={result.sub} variant={result.variant} />
      )}
    </div>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────── */
export default function InfectologiaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Infectología</h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          CURB-65 para neumonía · Sepsis-3
        </p>
      </div>
      <Curb65 />
      <Sepsis3 />
      <MedicalDisclaimer />
    </div>
  );
}
