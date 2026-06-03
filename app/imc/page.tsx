"use client";

import { useMemo, useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { bmiCategoryEs, computeBmiKgM2 } from "@/lib/clinical";

const BMI_COLOR: Record<string, string> = {
  "Bajo peso": "text-blue-700",
  Normopeso: "text-green-700",
  Sobrepeso: "text-yellow-700",
  "Obesidad grado I": "text-orange-600",
  "Obesidad grado II": "text-orange-700",
  "Obesidad grado III (mórbida)": "text-red-700",
};

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

  const categoryColor =
    result.ok && !Number.isNaN(result.bmi)
      ? (BMI_COLOR[result.category] ?? "text-slate-800")
      : "text-slate-800";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Calculadora de IMC</h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          IMC = peso (kg) / talla² (m). Categorías OMS para adultos ≥18 años.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
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
          {result.ok && !Number.isNaN(result.bmi) ? result.bmi.toFixed(1) : "—"}{" "}
          <span className="text-base font-semibold text-teal-800">kg/m²</span>
        </p>
        {result.ok && !Number.isNaN(result.bmi) && (
          <p className={`mt-2 text-sm font-semibold ${categoryColor}`}>
            {result.category}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden text-sm">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2 text-left font-medium">IMC (kg/m²)</th>
              <th className="px-4 py-2 text-left font-medium">Categoría OMS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ["< 18,5", "Bajo peso"],
              ["18,5 – 24,9", "Normopeso"],
              ["25,0 – 29,9", "Sobrepeso"],
              ["30,0 – 34,9", "Obesidad grado I"],
              ["35,0 – 39,9", "Obesidad grado II"],
              ["≥ 40,0", "Obesidad grado III (mórbida)"],
            ].map(([range, cat]) => (
              <tr
                key={range}
                className={
                  result.ok && result.category === cat
                    ? "bg-teal-50 font-semibold"
                    : ""
                }
              >
                <td className="px-4 py-2 tabular-nums text-slate-700">{range}</td>
                <td className={`px-4 py-2 ${BMI_COLOR[cat] ?? ""}`}>{cat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
