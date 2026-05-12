"use client";

import { useMemo, useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import {
  ANTIBIOTIC_OPTIONS,
  type AntibioticId,
  renalGuidanceEs,
} from "@/lib/antibioticRenal";

export default function AntibioticRenalPage() {
  const [crcl, setCrcl] = useState("");
  const [drug, setDrug] = useState<AntibioticId>("ciprofloxacino");

  const cr = Number(crcl.replace(",", "."));
  const guidance = useMemo(() => renalGuidanceEs(drug, cr), [drug, cr]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Ajuste de antibióticos por función renal
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Introduce una estimación de depuración (p. ej. CrCl Cockcroft–Gault en
          mL/min) y elige un fármaco para ver recordatorios generales. No
          incluye dosis milimétricas: debes cruzar con tu guía hospitalaria.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">
            CrCl aproximada (mL/min)
          </span>
          <input
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40"
            value={crcl}
            onChange={(e) => setCrcl(e.target.value)}
            placeholder="p. ej. 38"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Antibiótico</span>
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40 bg-white"
            value={drug}
            onChange={(e) => setDrug(e.target.value as AntibioticId)}
          >
            {ANTIBIOTIC_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{guidance.title}</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
          {guidance.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
        Zona reservada para publicidad (p. ej. AdSense).
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
