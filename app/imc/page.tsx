"use client";

import { useMemo, useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { bmiCategoryEs, computeBmiKgM2 } from "@/lib/clinical";

export default function ImcPage() {
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");

  const result = useMemo(() => {
    const w = Number(weight.replace(",", "."));
    const hCm = Number(heightCm.replace(",", "."));
    const hM = hCm / 100;
    const bmi = computeBmiKgM2(w, hM);
    return { bmi, category: bmiCategoryEs(bmi), ok: w > 0 && hM > 0 };
  }, [weight, heightCm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Calculadora de IMC</h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          IMC = peso (kg) / talla (m)². Categorías orientativas para adultos.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Peso (kg)</span>
          <input
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="p. ej. 72"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Talla (cm)</span>
          <input
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="p. ej. 172"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-teal-100 bg-teal-50/80 p-5">
        <p className="text-sm text-slate-600">Resultado</p>
        <p className="mt-1 text-3xl font-bold text-teal-900 tabular-nums">
          {result.ok && !Number.isNaN(result.bmi)
            ? result.bmi.toFixed(1)
            : "—"}{" "}
          <span className="text-base font-semibold text-teal-800">kg/m²</span>
        </p>
        {result.ok && !Number.isNaN(result.bmi) && (
          <p className="mt-2 text-sm text-slate-700">
            Categoría orientativa:{" "}
            <span className="font-semibold">{result.category}</span>
          </p>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
        Zona reservada para publicidad (p. ej. AdSense) cuando apruebes la
        política de contenido médico.
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
