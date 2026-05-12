"use client";

import { useMemo, useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { cockcroftGaultMlMin } from "@/lib/clinical";

export default function ClearancePage() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [scr, setScr] = useState("");
  const [female, setFemale] = useState(false);

  const crcl = useMemo(() => {
    const ageYears = Number(age.replace(",", "."));
    const weightKg = Number(weight.replace(",", "."));
    const scrMgDl = Number(scr.replace(",", "."));
    return cockcroftGaultMlMin({
      ageYears,
      weightKg,
      scrMgDl,
      female,
    });
  }, [age, weight, scr, female]);

  const ok = age && weight && scr && !Number.isNaN(crcl) && crcl > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Clearance de creatinina (Cockcroft–Gault)
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Fórmula clásica en mg/dL para estimar mL/min (no normalizado a 1,73
          m²). Útil como referencia para dosificación en adultos; contrasta con
          eGFR si tu centro usa CKD-EPI para otras decisiones.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Edad (años)</span>
          <input
            inputMode="numeric"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="p. ej. 68"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Peso (kg)</span>
          <input
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="p. ej. 70"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">
            Creatinina sérica (mg/dL)
          </span>
          <input
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40"
            value={scr}
            onChange={(e) => setScr(e.target.value)}
            placeholder="p. ej. 1,1"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={female}
            onChange={(e) => setFemale(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Sexo: femenino (factor 0,85 en la fórmula)
        </label>
      </div>

      <div className="rounded-2xl border border-teal-100 bg-teal-50/80 p-5">
        <p className="text-sm text-slate-600">CrCl estimada</p>
        <p className="mt-1 text-3xl font-bold text-teal-900 tabular-nums">
          {ok ? Math.round(crcl) : "—"}{" "}
          <span className="text-base font-semibold text-teal-800">mL/min</span>
        </p>
        {!ok && (
          <p className="mt-2 text-xs text-slate-600">
            Introduce valores válidos (creatinina &gt; 0, edad y peso &gt; 0).
          </p>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
        Zona reservada para publicidad (p. ej. AdSense).
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
