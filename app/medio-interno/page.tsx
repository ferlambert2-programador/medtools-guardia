"use client";

import { useState, useMemo } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { analyzeAcidBase } from "@/lib/clinical";
import type { AcidBaseResult, AcidBasePrimaryType } from "@/lib/clinical";

type Mode = "ventilado" | "no_ventilado";
type Variant = "success" | "warning" | "danger" | "info" | "neutral";

const IN =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40";

function Field({
  label,
  unit,
  value,
  onChange,
  placeholder,
  readOnly,
  integer,
  rightSlot,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  integer?: boolean;
  rightSlot?: React.ReactNode;
}) {
  const inputEl = (
    <input
      type="text"
      inputMode={integer ? "numeric" : "decimal"}
      pattern={integer ? "[0-9]*" : "[0-9.,\\-]*"}
      className={`${rightSlot ? "flex-1 min-w-0" : "w-full"} rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40 ${readOnly ? "bg-teal-50/80 border-teal-200 text-teal-800 font-semibold" : ""}`}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      readOnly={readOnly}
      placeholder={placeholder ?? ""}
    />
  );
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {unit && <span className="ml-1 text-xs text-slate-400">{unit}</span>}
      </span>
      {rightSlot ? (
        <div className="flex gap-1.5">{inputEl}{rightSlot}</div>
      ) : inputEl}
    </label>
  );
}

const VCLS: Record<Variant, string> = {
  success: "bg-green-50 border-green-200 text-green-900",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
  danger: "bg-red-50 border-red-200 text-red-900",
  info: "bg-teal-50 border-teal-200 text-teal-900",
  neutral: "bg-slate-50 border-slate-200 text-slate-700",
};

function ResultRow({
  label,
  value,
  detail,
  variant,
}: {
  label: string;
  value: string;
  detail?: string;
  variant: Variant;
}) {
  return (
    <div className={`rounded-xl border p-3.5 ${VCLS[variant]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-0.5 font-semibold">{value}</p>
      {detail && <p className="mt-1 text-sm leading-snug opacity-80">{detail}</p>}
    </div>
  );
}

function diagVariant(type: AcidBasePrimaryType, phNormal: boolean): Variant {
  if (phNormal) return type === "normal" ? "success" : "info";
  if (type === "normal") return "success";
  if (type === "mixed" || type === "acmet" || type === "acresp") return "danger";
  return "warning";
}

function compVariant(status: AcidBaseResult["compensation"]["status"]): Variant {
  if (status === "adecuada") return "success";
  if (status === "no_aplica") return "neutral";
  return "warning";
}

export default function MedioInternoPage() {
  const [mode, setMode] = useState<Mode>("ventilado");

  const [vt, setVt] = useState("");
  const [fr, setFr] = useState("");
  const [peep, setPeep] = useState("");
  const [fio2, setFio2] = useState("");
  const [pplat, setPplat] = useState("");

  const [ph, setPh] = useState("");
  const [paCO2, setPaCO2] = useState("");
  const [paO2, setPaO2] = useState("");
  const [hco3, setHco3] = useState("");
  const [eb, setEb] = useState("");
  const [lactato, setLactato] = useState("");
  const [fio2NoVent, setFio2NoVent] = useState("0.21");

  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [edad, setEdad] = useState("");

  const p = (s: string) => parseFloat(s.replace(",", "."));

  const toggleEbSign = () =>
    setEb((v) => (v.startsWith("-") ? v.slice(1) : v && v !== "0" ? "-" + v : v));

  const dpAuto = useMemo(() => {
    const pv = p(peep);
    const ppv = p(pplat);
    return !isNaN(pv) && !isNaN(ppv) && ppv > pv ? (ppv - pv).toFixed(1) : "";
  }, [peep, pplat]);

  const result = useMemo<AcidBaseResult | null>(() => {
    const pH = p(ph);
    const co2 = p(paCO2);
    const o2 = p(paO2);
    const bicarb = p(hco3);

    let fio2Val = p(mode === "ventilado" ? fio2 : fio2NoVent);
    if (!isNaN(fio2Val) && fio2Val > 1 && fio2Val <= 100) fio2Val = fio2Val / 100;

    if ([pH, co2, o2, bicarb].some(isNaN)) return null;
    if (pH < 6.5 || pH > 8 || co2 <= 0 || o2 <= 0 || bicarb <= 0) return null;
    if (isNaN(fio2Val) || fio2Val <= 0 || fio2Val > 1) return null;

    const peepV = p(peep);
    const pplatV = p(pplat);
    const naV = p(na);
    const clV = p(cl);
    const ebV = p(eb);
    const lacV = p(lactato);
    const ageV = p(edad);

    return analyzeAcidBase({
      pH, paCO2: co2, hco3: bicarb, paO2: o2, fiO2: fio2Val,
      na: isNaN(naV) ? undefined : naV,
      cl: isNaN(clV) ? undefined : clV,
      age: isNaN(ageV) ? undefined : ageV,
      eb: isNaN(ebV) ? undefined : ebV,
      lactate: isNaN(lacV) ? undefined : lacV,
      ventilated: mode === "ventilado",
      peep: isNaN(peepV) ? undefined : peepV,
      pplat: isNaN(pplatV) ? undefined : pplatV,
    });
  }, [ph, paCO2, paO2, hco3, fio2, fio2NoVent, peep, pplat, na, cl, eb, lactato, edad, mode]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Medio Interno</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Gasometría arterial · Trastornos ácido-base · Gradiente A-a · Soporte ventilatorio
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(["ventilado", "no_ventilado"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              mode === m
                ? "bg-teal-600 text-white border-teal-600"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {m === "ventilado" ? "💨 Paciente ventilado" : "🩺 No ventilado"}
          </button>
        ))}
      </div>

      {/* Ventilator parameters */}
      {mode === "ventilado" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800">Parámetros ventilatorios</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Vt" unit="mL" value={vt} onChange={setVt} placeholder="450" integer />
            <Field label="FR" unit="rpm" value={fr} onChange={setFr} placeholder="16" integer />
            <Field label="PEEP" unit="cmH₂O" value={peep} onChange={setPeep} placeholder="5" />
            <Field label="FiO₂" unit="0–1 ó 21–100" value={fio2} onChange={setFio2} placeholder="0.40" />
            <Field label="Pplat" unit="cmH₂O" value={pplat} onChange={setPplat} placeholder="22" />
            <Field label="DP (auto)" unit="cmH₂O" value={dpAuto} readOnly placeholder="—" />
          </div>
        </div>
      )}

      {/* ABG */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800">Gasometría arterial</h2>
        {mode === "no_ventilado" && (
          <Field
            label="FiO₂"
            unit="0.21 = aire ambiente"
            value={fio2NoVent}
            onChange={setFio2NoVent}
            placeholder="0.21"
          />
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="pH" value={ph} onChange={setPh} placeholder="7.32" />
          <Field label="PaCO₂" unit="mmHg" value={paCO2} onChange={setPaCO2} placeholder="55" />
          <Field label="PaO₂" unit="mmHg" value={paO2} onChange={setPaO2} placeholder="68" />
          <Field label="HCO₃⁻" unit="mEq/L" value={hco3} onChange={setHco3} placeholder="22" />
          <Field
              label="EB"
              unit="mEq/L"
              value={eb}
              onChange={setEb}
              placeholder="4"
              rightSlot={
                <button
                  type="button"
                  onClick={toggleEbSign}
                  className="shrink-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  ±
                </button>
              }
            />
          <Field label="Lactato" unit="mmol/L" value={lactato} onChange={setLactato} placeholder="2.1" />
        </div>
      </div>

      {/* Electrolytes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800">Electrolitos y datos clínicos</h2>
        <p className="text-xs text-slate-500">
          Na⁺ y Cl⁻ para anion gap y delta-delta · Edad para gradiente A-a esperado
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Na⁺" unit="mEq/L" value={na} onChange={setNa} placeholder="140" integer />
          <Field label="Cl⁻" unit="mEq/L" value={cl} onChange={setCl} placeholder="105" integer />
          <Field label="Edad" unit="años" value={edad} onChange={setEdad} placeholder="65" integer />
        </div>
      </div>

      {/* Results */}
      {result ? (
        <div className="rounded-2xl border border-teal-100 bg-teal-50/20 p-5 shadow-sm space-y-3">
          <h2 className="font-bold text-slate-800">Resultados</h2>

          <ResultRow
            label="Diagnóstico ácido-base"
            value={result.primaryDisorder}
            variant={diagVariant(result.primaryType, result.phNormal)}
          />

          <ResultRow
            label="Compensación esperada"
            value={result.compensation.formula}
            detail={result.compensation.expected}
            variant={compVariant(result.compensation.status)}
          />

          <ResultRow
            label="Anion gap (Na⁺ − Cl⁻ − HCO₃⁻)"
            value={result.anionGapStatus}
            variant={result.anionGap !== null ? (result.anionGap > 12 ? "danger" : "success") : "neutral"}
          />

          <ResultRow
            label="Delta-delta (Δ/Δ)"
            value={result.deltaRatioInterp}
            variant={
              result.deltaRatio !== null && result.deltaRatio >= 1 && result.deltaRatio <= 2
                ? "info"
                : result.deltaRatio !== null
                ? "warning"
                : "neutral"
            }
          />

          <ResultRow
            label={`Gradiente A-a${result.aaGradientExpected ? ` (esperado ≤${(result.aaGradientExpected + 10).toFixed(0)} mmHg)` : ""}`}
            value={`${result.aaGradient.toFixed(1)} mmHg`}
            detail={result.aaGradientStatus}
            variant={
              result.aaGradient <= (result.aaGradientExpected !== null ? result.aaGradientExpected + 10 : 15)
                ? "success"
                : "warning"
            }
          />

          {result.ebStatus && (
            <ResultRow
              label="Exceso de bases (EB)"
              value={result.ebStatus}
              variant={p(eb) >= -2 && p(eb) <= 2 ? "success" : "warning"}
            />
          )}

          {result.lactateStatus && (
            <ResultRow
              label="Lactato"
              value={result.lactateStatus}
              variant={p(lactato) < 2 ? "success" : p(lactato) < 4 ? "warning" : "danger"}
            />
          )}

          {mode === "ventilado" && result.drivePressure !== undefined && (
            <ResultRow
              label="Driving Pressure (DP = Pplat − PEEP)"
              value={`${result.drivePressure.toFixed(1)} cmH₂O`}
              detail={result.drivePressureStatus}
              variant={result.drivePressure < 15 ? "success" : "danger"}
            />
          )}

          {mode === "ventilado" && result.pFRatio !== undefined && (
            <ResultRow
              label="Relación P/F (PaO₂ / FiO₂)"
              value={`${result.pFRatio.toFixed(0)} mmHg`}
              detail={result.pFRatioInterp}
              variant={result.pFRatio > 300 ? "success" : result.pFRatio > 200 ? "warning" : "danger"}
            />
          )}

          {mode === "ventilado" && result.oxygenationIndex !== undefined && (
            <ResultRow
              label="Índice de oxigenación (IO)"
              value={result.oxygenationIndex.toFixed(1)}
              detail={`${result.oiInterp} · IO = FiO₂ × 100 × PAM / PaO₂ (PAM estimada: PEEP + DP/3)`}
              variant={result.oxygenationIndex < 5 ? "success" : result.oxygenationIndex < 10 ? "warning" : "danger"}
            />
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 text-center">
          {mode === "ventilado"
            ? "Completá pH, PaCO₂, PaO₂, HCO₃ y FiO₂ para ver los resultados."
            : "Completá pH, PaCO₂, PaO₂ y HCO₃ para ver los resultados."}
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
}
