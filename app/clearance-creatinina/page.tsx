"use client";

import { useMemo, useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import {
  cockcroftGaultMlMin,
  ckdEpi2021,
  mdrd4,
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

const INPUT =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40";

export default function ClearancePage() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [scr, setScrRaw] = useState("");
  const [female, setFemale] = useState(false);
  const [blackRace, setBlackRace] = useState(false);

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

  const mdrdResult = useMemo(
    () => mdrd4({ ageYears: parsed.ageYears, scrMgDl: parsed.scrMgDl, female, blackRace }),
    [parsed.ageYears, parsed.scrMgDl, female, blackRace],
  );

  const crclOk = age && weight && scr && !Number.isNaN(crcl) && crcl > 0;
  const ckdOk = age && scr && !Number.isNaN(ckdEpiResult) && ckdEpiResult > 0;
  const mdrdOk = age && scr && !Number.isNaN(mdrdResult) && mdrdResult > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Clearance de creatinina
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Cockcroft–Gault (mL/min) para dosificación · CKD-EPI 2021 y MDRD (mL/min/1,73 m²) para estadificación.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Edad (años)</span>
          <input
            inputMode="numeric"
            className={INPUT}
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
            className={INPUT}
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
            className={INPUT}
            value={scr}
            onChange={(e) => setScrRaw(e.target.value)}
            placeholder="p. ej. 1,1"
          />
        </label>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={female}
              onChange={(e) => setFemale(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            Sexo femenino
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={blackRace}
              onChange={(e) => setBlackRace(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            Raza negra{" "}
            <span className="text-slate-400">(solo MDRD)</span>
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Cockcroft–Gault"
          value={crclOk ? Math.round(crcl).toString() : "—"}
          unit="mL/min"
          sub={
            crclOk
              ? `Estadio ${egfrStage(crcl)} · ${egfrStageLabel(egfrStage(crcl))}`
              : "Necesita edad, peso y Cr"
          }
        />
        <ResultCard
          label="CKD-EPI 2021"
          value={ckdOk ? Math.round(ckdEpiResult).toString() : "—"}
          unit="mL/min/1,73 m²"
          sub={
            ckdOk
              ? `Estadio ${egfrStage(ckdEpiResult)} · ${egfrStageLabel(egfrStage(ckdEpiResult))}`
              : "Necesita edad y Cr"
          }
        />
        <ResultCard
          label="MDRD-4"
          value={mdrdOk ? Math.round(mdrdResult).toString() : "—"}
          unit="mL/min/1,73 m²"
          sub={
            mdrdOk
              ? `Estadio ${egfrStage(mdrdResult)} · ${egfrStageLabel(egfrStage(mdrdResult))}`
              : "Necesita edad y Cr"
          }
        />
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500 space-y-1">
        <p>
          <strong>Cockcroft–Gault</strong> se recomienda para ajuste de dosis de fármacos (no normalizado a superficie corporal).
        </p>
        <p>
          <strong>CKD-EPI 2021</strong> es el estándar actual para estadificación de ERC (KDIGO 2022), sin corrección por raza.
        </p>
        <p>
          <strong>MDRD-4</strong> sigue siendo de referencia histórica; tiende a subestimar la TFG en valores normales.
        </p>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
