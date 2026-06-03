"use client";

import { useMemo, useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import {
  ANTIBIOTICS,
  ANTIBIOTIC_GROUPS,
  BAND_LABELS,
  BAND_COLORS,
  renalBandFromCrCl,
} from "@/lib/antibioticRenal";

export default function AjusteAntibioticosPage() {
  const [crclRaw, setCrclRaw] = useState("");
  const [selectedId, setSelectedId] = useState(ANTIBIOTICS[0].id);

  const crcl = Number(crclRaw.replace(",", "."));
  const crclValid = crclRaw !== "" && crcl > 0 && !Number.isNaN(crcl);

  const antibiotic = useMemo(
    () => ANTIBIOTICS.find((a) => a.id === selectedId) ?? ANTIBIOTICS[0],
    [selectedId],
  );

  const band = crclValid ? renalBandFromCrCl(crcl) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Ajuste de antibióticos por función renal
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Dosis orientativas según clearance de creatinina (Cockcroft–Gault).
          Verificar siempre con guías institucionales y ficha técnica actualizada.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">
            Clearance de creatinina estimado (mL/min)
          </span>
          <input
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40"
            value={crclRaw}
            onChange={(e) => setCrclRaw(e.target.value)}
            placeholder="p. ej. 45"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Antibiótico</span>
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40 bg-white"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {ANTIBIOTIC_GROUPS.map((group) => (
              <optgroup key={group} label={group}>
                {ANTIBIOTICS.filter((a) => a.group === group).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      </div>

      {band ? (
        <div
          className={`rounded-2xl border p-5 space-y-4 ${BAND_COLORS[band]}`}
        >
          <div>
            <p className="text-sm font-medium opacity-70">Antibiótico</p>
            <p className="text-xl font-bold">{antibiotic.label}</p>
          </div>

          <div>
            <p className="text-sm font-medium opacity-70">Función renal</p>
            <p className="font-semibold">
              ClCr {crcl} mL/min — {BAND_LABELS[band]}
            </p>
          </div>

          <div className="rounded-xl bg-white/60 border border-current/10 p-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
              Dosis recomendada
            </p>
            <p className="text-lg font-bold leading-snug">
              {antibiotic.doses[band]}
            </p>
          </div>

          <p className="text-sm opacity-80">
            <span className="font-semibold">Nota:</span> {antibiotic.note}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          Ingresá el clearance para ver la dosis recomendada.
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
}
