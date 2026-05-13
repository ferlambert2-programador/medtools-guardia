"use client";

import { useMemo, useState } from "react";

type AntibioticKey =
  | "Piperacilina/Tazobactam"
  | "Vancomicina"
  | "Meropenem"
  | "Cefepime"
  | "Levofloxacina";

const recommendations = {
  "Piperacilina/Tazobactam": {
    normal:
      "Generalmente no requiere ajuste renal significativo.",
    moderate:
      "Considerar prolongar intervalos o reducir dosis según protocolo institucional.",
    severe:
      "Requiere ajuste renal importante y monitorización clínica.",
  },

  Vancomicina: {
    normal:
      "Controlar función renal y niveles plasmáticos según contexto clínico.",
    moderate:
      "Ajustar intervalo y monitorizar niveles valle.",
    severe:
      "Riesgo elevado de acumulación y nefrotoxicidad. Requiere seguimiento estrecho.",
  },

  Meropenem: {
    normal:
      "Habitualmente sin ajuste importante.",
    moderate:
      "Puede requerir reducción de dosis o aumento del intervalo.",
    severe:
      "Ajuste renal obligatorio según clearance y gravedad clínica.",
  },

  Cefepime: {
    normal:
      "Sin ajuste renal relevante en función conservada.",
    moderate:
      "Reducir dosis o espaciar administración.",
    severe:
      "Mayor riesgo de neurotoxicidad. Ajuste renal estricto.",
  },

  Levofloxacina: {
    normal:
      "Generalmente sin ajuste significativo.",
    moderate:
      "Puede requerir espaciamiento de dosis.",
    severe:
      "Riesgo de acumulación. Ajustar cuidadosamente.",
  },
};

export default function AjusteAntibioticosPage() {
  const [crcl, setCrcl] = useState(70);
  const [drug, setDrug] =
    useState<AntibioticKey>("Piperacilina/Tazobactam");

  const result = useMemo(() => {
    if (crcl >= 60) {
      return {
        category: "Función renal conservada",
        recommendation: recommendations[drug].normal,
        color: "bg-green-50 border-green-200",
      };
    }

    if (crcl >= 30) {
      return {
        category: "Insuficiencia renal moderada",
        recommendation: recommendations[drug].moderate,
        color: "bg-yellow-50 border-yellow-200",
      };
    }

    return {
      category: "Insuficiencia renal severa",
      recommendation: recommendations[drug].severe,
      color: "bg-red-50 border-red-200",
    };
  }, [crcl, drug]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <section className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Ajuste renal de antibióticos
        </h1>

        <p className="text-gray-600 text-lg">
          Herramienta orientativa para ajuste general de antibióticos
          según función renal estimada.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="font-medium">
              Clearance estimado (mL/min)
            </label>

            <input
              type="number"
              value={crcl}
              onChange={(e) => setCrcl(Number(e.target.value))}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Antibiótico</label>

            <select
              value={drug}
              onChange={(e) =>
                setDrug(e.target.value as AntibioticKey)
              }
              className="w-full rounded-xl border p-3"
            >
              {Object.keys(recommendations).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div
          className={`rounded-2xl border p-6 shadow-sm space-y-4 ${result.color}`}
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {drug}
            </h2>

            <p>
              <strong>Clearance:</strong> {crcl} mL/min
            </p>

            <p>
              <strong>Categoría renal:</strong>{" "}
              {result.category}
            </p>
          </div>

          <div className="rounded-xl bg-white/70 p-4 border">
            <p className="leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            <p>
              ⚠️ Confirmar siempre con guía local,
              farmacología clínica y ficha técnica.
            </p>

            <p>
              Esta herramienta no reemplaza criterio médico
              ni constituye una prescripción definitiva.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}