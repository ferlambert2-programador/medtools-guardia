"use client";

import { useMemo, useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import {
  cockcroftGaultMlMin,
  ckdEpi2021,
  egfrStage,
  egfrStageLabel,
} from "@/lib/clinical";

function ResultCard({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/80 p-5">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-3xl font-bold text-teal-900 tabular-nums">
        {value}{" "}
        <span className="text-base font-semibold text-teal-800">{unit}</span>
      </p>
      {sub && <p className="mt-1.5 text-sm text-slate-700">{sub}</p>}
    </div>
  );
}

export default function ClearancePage() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [scr, setScrRaw] = useState("");
  const [female, setFemale] = useState(false);

  const parsed = useMemo(() => {
    const ageYears = Number(age.replace(",", "."));
    const weightKg = Number(weight.replace(",", "."));
    const scrMgDl = Number(scr.replace(",", "."));
    return { ageYears, weightKg, scrMgDl };
  }, [age, weight, scr]);

  const crcl = useMemo(
    () => cockcroftGaultMlMin({ ...parsed, female }),
    [parsed, female],
  );

  const ckdEpiResult = useMemo(
    () => ckdEpi2021({ ageYears: parsed.ageYears, scrMgDl: parsed.scrMgDl, female }),
    [parsed.ageYears, parsed.scrMgDl, female],
  );

  const crclOk = age && weight && scr && !Number.isNaN(crcl) && crcl > 0;
  const ckdOk = age && scr && !Number.isNaN(ckdEpiResult) && ckdEpiResult > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Clearance de creatinina
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Cockcroft–Gault (mL/min, no normalizado) para dosificación y
          CKD-EPI 2021 (mL/min/1,73 m²) para estadificación renal.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
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
          <span className="text-sm font-medium text-slate-700">
            Peso (kg){" "}
            <span className="text-slate-400 font-normal">(solo para Cockcroft–Gault)</span>
          </span>
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
            onChange={(e) => setScrRaw(e.target.value)}
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
          Sexo femenino
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard
          label="Cockcroft–Gault"
          value={crclOk ? Math.round(crcl).toString() : "—"}
          unit="mL/min"
          sub={
            crclOk
              ? `Estadio ${egfrStage(crcl)} · ${egfrStageLabel(egfrStage(crcl))}`
              : "Completá edad, peso y creatinina"
          }
        />
        <ResultCard
          label="CKD-EPI 2021"
          value={ckdOk ? Math.round(ckdEpiResult).toString() : "—"}
          unit="mL/min/1,73 m²"
          sub={
            ckdOk
              ? `Estadio ${egfrStage(ckdEpiResult)} · ${egfrStageLabel(egfrStage(ckdEpiResult))}`
              : "Completá edad y creatinina"
          }
        />
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500 space-y-1">
        <p>
          <strong>Cockcroft–Gault</strong> se recomienda para ajuste de dosis de fármacos.
        </p>
        <p>
          <strong>CKD-EPI 2021</strong> es el estándar actual para estadificación de ERC (KDIGO 2022).
        </p>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
