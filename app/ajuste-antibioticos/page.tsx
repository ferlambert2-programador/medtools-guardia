"use client";

import { useState } from "react";

export default function AjusteAntibioticosPage() {
  const [crcl, setCrcl] = useState("45");
  const [drug, setDrug] = useState("piperacilina");

  const cr = Number(crcl);

  function getRecommendation() {
    if (!cr || cr <= 0) {
      return "Ingresá un clearance válido.";
    }

    if (drug === "piperacilina") {
      if (cr > 40) return "3,375–4,5 g IV cada 6 h según foco y gravedad.";
      if (cr >= 20) return "2,25 g IV cada 6 h.";
      return "2,25 g IV cada 8 h.";
    }

    if (drug === "meropenem") {
      if (cr > 50) return "1 g IV cada 8 h.";
      if (cr >= 26) return "1 g IV cada 12 h.";
      if (cr >= 10) return "500 mg IV cada 12 h.";
      return "500 mg IV cada 24 h.";
    }

    if (drug === "cefepime") {
      if (cr > 60) return "2 g IV cada 8–12 h.";
      if (cr >= 30) return "2 g IV cada 24 h.";
      if (cr >= 11) return "1 g IV cada 24 h.";
      return "500 mg IV cada 24 h.";
    }

    if (drug === "ciprofloxacino") {
      if (cr >= 50) return "Dosis habitual.";
      if (cr >= 30) return "400 mg IV cada 12–24 h.";
      return "Reducir dosis o espaciar intervalo.";
    }

    if (drug === "vancomicina") {
      return "No ajustar solo por clearance. Requiere monitoreo de niveles.";
    }

    return "Sin recomendación.";
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Ajuste de antibióticos por función renal
      </h1>

      <div className="border rounded-2xl p-6 space-y-4">
        <div>
          <label className="block mb-2 font-medium">
            Clearance aproximado (mL/min)
          </label>

          <input
            className="w-full border rounded-xl p-3"
            value={crcl}
            onChange={(e) => setCrcl(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Antibiótico
          </label>

          <select
            className="w-full border rounded-xl p-3"
            value={drug}
            onChange={(e) => setDrug(e.target.value)}
          >
            <option value="piperacilina">
              Piperacilina/Tazobactam
            </option>

            <option value="meropenem">
              Meropenem
            </option>

            <option value="cefepime">
              Cefepime
            </option>

            <option value="ciprofloxacino">
              Ciprofloxacino
            </option>

            <option value="vancomicina">
              Vancomicina
            </option>
          </select>
        </div>
      </div>

      <div className="border rounded-2xl p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">
          Recomendación
        </h2>

        <p>{getRecommendation()}</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
        Uso orientativo. Verificar siempre con guía institucional y ficha técnica.
      </div>
    </main>
  );
}