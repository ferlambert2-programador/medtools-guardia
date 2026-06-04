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

function ScoreItem({
  label,
  name,
  value,
  points,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  points: number;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">
        {label}{" "}
        <span className="text-slate-400 font-normal">(+{points})</span>
      </span>
      <div className="flex gap-2">
        {["Sí", "No"].map((opt) => {
          const v = opt === "Sí" ? String(points) : "0";
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
    </label>
  );
}

/* ── CHA₂DS₂-VASc ───────────────────────────────────────────── */
function Cha2ds2Vasc() {
  const [c, setC] = useState("0");
  const [h, setH] = useState("0");
  const [a2, setA2] = useState("0");
  const [d, setD] = useState("0");
  const [s2, setS2] = useState("0");
  const [v, setV] = useState("0");
  const [a, setA] = useState("0");
  const [sc, setSc] = useState("0");

  const score = [c, h, a2, d, s2, v, a, sc].reduce((sum, val) => sum + Number(val), 0);
  const annualRisk = ["~0%", "~1,3%", "~2,2%", "~3,2%", "~4,0%", "~6,7%", "~9,8%", "~9,8%", "~9,8%", "~9,8%"][Math.min(score, 9)];

  const { rec, variant }: { rec: string; variant: Variant } =
    score === 0
      ? { rec: "Riesgo muy bajo. No anticoagular.", variant: "success" }
      : score === 1
      ? { rec: "Varón: considerar anticoagulación. Mujer: no anticoagular.", variant: "info" }
      : score <= 2
      ? { rec: "Anticoagulación recomendada (NACO de primera elección).", variant: "warning" }
      : { rec: "Anticoagulación indicada. Alto riesgo tromboembólico.", variant: "danger" };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">CHA₂DS₂-VASc — FA</h2>
      <ScoreItem label="Insuficiencia cardíaca congestiva" name="cha-c" value={c} points={1} onChange={setC} />
      <ScoreItem label="Hipertensión" name="cha-h" value={h} points={1} onChange={setH} />
      <ScoreItem label="Edad ≥ 75 años" name="cha-a2" value={a2} points={2} onChange={setA2} />
      <ScoreItem label="Diabetes mellitus" name="cha-d" value={d} points={1} onChange={setD} />
      <ScoreItem label="ACV / TIA / tromboembolismo previo" name="cha-s2" value={s2} points={2} onChange={setS2} />
      <ScoreItem label="Enfermedad vascular (IAM, placa aórtica, EP previo)" name="cha-v" value={v} points={1} onChange={setV} />
      <ScoreItem label="Edad 65–74 años" name="cha-a" value={a} points={1} onChange={setA} />
      <ScoreItem label="Sexo femenino" name="cha-sc" value={sc} points={1} onChange={setSc} />
      <ResultBox
        value={`${score} pts`}
        sub={`${rec} · Riesgo anual ACV/AIT: ${annualRisk}`}
        variant={variant}
      />
    </div>
  );
}

/* ── HAS-BLED ────────────────────────────────────────────────── */
function HasBled() {
  const fields = [
    { label: "Hipertensión no controlada (PAS > 160)", name: "has-h" },
    { label: "Función renal o hepática anormal", name: "has-ab" },
    { label: "ACV previo", name: "has-s" },
    { label: "Sangrado previo o predisposición", name: "has-b" },
    { label: "Labilidad del INR (TTR < 60%)", name: "has-l" },
    { label: "Edad > 65 años", name: "has-e" },
    { label: "Fármacos (AAS, AINEs) o alcohol (≥ 8 beb/semana)", name: "has-d" },
  ];

  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, "0"]))
  );

  const score = Object.values(vals).reduce((sum, v) => sum + Number(v), 0);
  const annualRisk = ["~1%", "~1%", "~2%", "~3%", "~5%", "~7%", "~10%", "~10%"][Math.min(score, 7)];

  const { msg, variant }: { msg: string; variant: Variant } =
    score <= 1
      ? { msg: "Riesgo BAJO de sangrado mayor.", variant: "success" }
      : score <= 2
      ? { msg: "Riesgo INTERMEDIO de sangrado mayor.", variant: "warning" }
      : { msg: "Riesgo ALTO de sangrado mayor. Revisar factores corregibles.", variant: "danger" };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">HAS-BLED — Riesgo de sangrado en FA</h2>
      {fields.map(({ label, name }) => (
        <label key={name} className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <div className="flex gap-2">
            {["Sí", "No"].map((opt) => {
              const v = opt === "Sí" ? "1" : "0";
              return (
                <label
                  key={opt}
                  className={`flex-1 py-2 rounded-lg border text-sm text-center cursor-pointer transition-colors ${
                    vals[name] === v
                      ? "bg-teal-600 text-white border-teal-600 font-semibold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={name}
                    value={v}
                    checked={vals[name] === v}
                    onChange={() => setVals((prev) => ({ ...prev, [name]: v }))}
                    className="sr-only"
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </label>
      ))}
      <ResultBox
        value={`${score}/7`}
        sub={`${msg} · Riesgo anual sangrado mayor: ${annualRisk}`}
        variant={variant}
      />
    </div>
  );
}

/* ── KILLIP-KIMBALL ─────────────────────────────────────────── */
function Killip() {
  const [clase, setClase] = useState("1");

  const clases: { val: string; label: string; mort: string; variant: Variant }[] = [
    { val: "1", label: "Clase I — Sin signos de IC", mort: "~6%", variant: "success" },
    { val: "2", label: "Clase II — IC leve (crepitantes, ingurgitación yugular)", mort: "~17%", variant: "warning" },
    { val: "3", label: "Clase III — Edema agudo de pulmón", mort: "~30%", variant: "danger" },
    { val: "4", label: "Clase IV — Shock cardiogénico", mort: "~60%", variant: "danger" },
  ];

  const selected = clases.find((c) => c.val === clase)!;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Killip-Kimball — IAM</h2>
      <div className="space-y-2">
        {clases.map(({ val, label }) => (
          <label
            key={val}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
              clase === val
                ? "bg-teal-50 border-teal-300 text-teal-900 font-semibold"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="killip"
              value={val}
              checked={clase === val}
              onChange={() => setClase(val)}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>
      <ResultBox
        value={`Clase ${selected.val}`}
        sub={`Mortalidad intrahospitalaria: ${selected.mort}`}
        variant={selected.variant}
      />
    </div>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────── */
export default function CardiovascularPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cardiovascular</h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          CHA₂DS₂-VASc · HAS-BLED · Killip-Kimball
        </p>
      </div>
      <Cha2ds2Vasc />
      <HasBled />
      <Killip />
      <MedicalDisclaimer />
    </div>
  );
}
