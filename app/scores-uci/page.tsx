"use client";

import { useState, useMemo } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

/* ── shared helpers ─────────────────────────────────────────── */
function n(raw: string) {
  const v = Number(raw.replace(",", "."));
  return Number.isNaN(v) ? null : v;
}

type ResultVariant = "success" | "warning" | "danger" | "info";

function ResultBox({
  value,
  unit,
  sub,
  variant,
}: {
  value: string;
  unit?: string;
  sub?: string;
  variant: ResultVariant;
}) {
  const bg: Record<ResultVariant, string> = {
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    danger: "bg-red-50 border-red-200 text-red-900",
    info: "bg-teal-50 border-teal-200 text-teal-900",
  };
  return (
    <div className={`rounded-xl border p-4 mt-4 ${bg[variant]}`}>
      <p className="text-3xl font-bold tabular-nums">
        {value}
        {unit && <span className="text-base font-semibold ml-1">{unit}</span>}
      </p>
      {sub && <p className="mt-2 text-sm leading-snug">{sub}</p>}
    </div>
  );
}

function CardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const INPUT =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-teal-500/40 bg-white";

function RadioPair({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {["Sí", "No"].map((opt) => {
        const v = opt === "Sí" ? "1" : "0";
        return (
          <label
            key={opt}
            className={`flex-1 py-2 rounded-lg border text-sm text-center cursor-pointer transition-colors ${
              value === v
                ? "bg-teal-600 text-white border-teal-600 font-semibold"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
              className="sr-only"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

/* ── APACHE II ──────────────────────────────────────────────── */
function scoreTemp(t: number) {
  if (t >= 41) return 4; if (t >= 39) return 3; if (t >= 38.5) return 2;
  if (t >= 36) return 0; if (t >= 34) return 1; if (t >= 32) return 2;
  if (t >= 30) return 3; return 4;
}
function scorePam(p: number) {
  if (p >= 160) return 4; if (p >= 130) return 3; if (p >= 110) return 2;
  if (p >= 70) return 0; if (p >= 55) return 2; return 3;
}
function scoreFc(f: number) {
  if (f >= 180) return 4; if (f >= 140) return 3; if (f >= 110) return 2;
  if (f >= 70) return 0; if (f >= 55) return 2; return 3;
}
function scoreFr(f: number) {
  if (f >= 50) return 4; if (f >= 35) return 3; if (f >= 25) return 1;
  if (f >= 12) return 0; if (f >= 10) return 1; return 4;
}
function scorePh(ph: number) {
  if (ph >= 7.7) return 4; if (ph >= 7.6) return 3; if (ph >= 7.5) return 1;
  if (ph >= 7.33) return 0; if (ph >= 7.25) return 2; if (ph >= 7.15) return 3; return 4;
}
function scoreNa(na: number) {
  if (na >= 180) return 4; if (na >= 160) return 3; if (na >= 155) return 2;
  if (na >= 150) return 1; if (na >= 130) return 0; if (na >= 120) return 2;
  if (na >= 111) return 3; return 4;
}
function scoreK(k: number) {
  if (k >= 7) return 4; if (k >= 6) return 3; if (k >= 5.5) return 2;
  if (k >= 3.5) return 0; if (k >= 3) return 1; if (k >= 2.5) return 2; return 4;
}
function scoreCr(cr: number) {
  if (cr >= 3.5) return 4; if (cr >= 2) return 3; if (cr >= 1.5) return 2;
  if (cr >= 0.6) return 0; return 2;
}
function scoreHtc(h: number) {
  if (h >= 60) return 4; if (h >= 50) return 2; if (h >= 46) return 1;
  if (h >= 30) return 0; if (h >= 20) return 2; return 4;
}
function scoreLeu(l: number) {
  if (l >= 40) return 4; if (l >= 20) return 2; if (l >= 15) return 1;
  if (l >= 3) return 0; if (l >= 1) return 2; return 4;
}
function scoreAge(a: number) {
  if (a >= 75) return 6; if (a >= 65) return 5; if (a >= 55) return 3; if (a >= 45) return 2; return 0;
}
function apacheMortality(s: number) {
  if (s <= 4) return "~4%"; if (s <= 9) return "~8%"; if (s <= 14) return "~15%";
  if (s <= 19) return "~25%"; if (s <= 24) return "~40%"; if (s <= 29) return "~55%"; return "~75%";
}

function ApacheII() {
  const [temp, setTemp] = useState("");
  const [pam, setPam] = useState("");
  const [fc, setFc] = useState("");
  const [fr, setFr] = useState("");
  const [fio2, setFio2] = useState("");
  const [pao2, setPao2] = useState("");
  const [ph, setPh] = useState("");
  const [na, setNa] = useState("");
  const [k, setK] = useState("");
  const [cr, setCr] = useState("");
  const [htc, setHtc] = useState("");
  const [leu, setLeu] = useState("");
  const [glasgow, setGlasgow] = useState("");
  const [edad, setEdad] = useState("");
  const [cronica, setCronica] = useState("0");

  const result = useMemo(() => {
    const vals = [temp, pam, fc, fr, fio2, pao2, ph, na, k, cr, htc, leu, glasgow, edad].map((v) => n(v));
    if (vals.some((v) => v === null)) return null;
    const [vTemp, vPam, vFc, vFr, vFio2, vPao2, vPh, vNa, vK, vCr, vHtc, vLeu, vGlasgow, vEdad] = vals as number[];
    let score = 0;
    score += scoreTemp(vTemp); score += scorePam(vPam); score += scoreFc(vFc); score += scoreFr(vFr);
    if (vFio2 >= 50) {
      const aa = 713 * (vFio2 / 100) - vPao2 - 40 / 0.8;
      if (aa >= 500) score += 4; else if (aa >= 350) score += 3; else if (aa >= 200) score += 2;
    } else {
      if (vPao2 < 55) score += 4; else if (vPao2 < 60) score += 3; else if (vPao2 < 70) score += 1;
    }
    score += scorePh(vPh); score += scoreNa(vNa); score += scoreK(vK); score += scoreCr(vCr);
    score += scoreHtc(vHtc); score += scoreLeu(vLeu); score += 15 - vGlasgow;
    score += scoreAge(vEdad); score += Number(cronica);
    return score;
  }, [temp, pam, fc, fr, fio2, pao2, ph, na, k, cr, htc, leu, glasgow, edad, cronica]);

  const variant: ResultVariant = result === null ? "info" : result <= 9 ? "success" : result <= 19 ? "warning" : "danger";

  const inp = (val: string, set: (v: string) => void, placeholder: string) => (
    <input inputMode="decimal" className={INPUT} value={val} onChange={(e) => set(e.target.value)} placeholder={placeholder} />
  );

  return (
    <CardSection title="APACHE II">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Temperatura (°C)">{inp(temp, setTemp, "38,5")}</Field>
        <Field label="PA media (mmHg)">{inp(pam, setPam, "85")}</Field>
        <Field label="FC (lpm)">{inp(fc, setFc, "110")}</Field>
        <Field label="FR (rpm)">{inp(fr, setFr, "28")}</Field>
        <Field label="FiO₂ (%)">{inp(fio2, setFio2, "40")}</Field>
        <Field label="PaO₂ (mmHg)">{inp(pao2, setPao2, "75")}</Field>
        <Field label="pH arterial">{inp(ph, setPh, "7,30")}</Field>
        <Field label="Na⁺ (mEq/L)">{inp(na, setNa, "145")}</Field>
        <Field label="K⁺ (mEq/L)">{inp(k, setK, "3,5")}</Field>
        <Field label="Creatinina (mg/dL)">{inp(cr, setCr, "2,0")}</Field>
        <Field label="Hematocrito (%)">{inp(htc, setHtc, "35")}</Field>
        <Field label="Leucocitos (×10³/μL)">{inp(leu, setLeu, "15")}</Field>
        <Field label="Glasgow (3–15)">{inp(glasgow, setGlasgow, "12")}</Field>
        <Field label="Edad (años)">{inp(edad, setEdad, "65")}</Field>
      </div>
      <Field label="Enfermedad crónica grave">
        <div className="flex gap-2 flex-wrap">
          {[
            { val: "0", label: "Ninguna" },
            { val: "2", label: "No quirúrgica (+2)" },
            { val: "5", label: "Post-quirúrgica (+5)" },
          ].map(({ val, label }) => (
            <label key={val} className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${cronica === val ? "bg-teal-600 text-white border-teal-600 font-semibold" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              <input type="radio" name="apache-cronica" value={val} checked={cronica === val} onChange={() => setCronica(val)} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </Field>
      {result !== null ? (
        <ResultBox value={`${result} pts`} variant={variant} sub={`Mortalidad estimada: ${apacheMortality(result)}`} />
      ) : (
        <p className="text-sm text-slate-500">Completá todos los campos para ver el resultado.</p>
      )}
    </CardSection>
  );
}

/* ── SOFA ───────────────────────────────────────────────────── */
function Sofa() {
  const [pf, setPf] = useState("");
  const [plaq, setPlaq] = useState("");
  const [bili, setBili] = useState("");
  const [pam, setPam] = useState("");
  const [glasgow, setGlasgow] = useState("");
  const [cr, setCr] = useState("");

  const result = useMemo(() => {
    const vals = [pf, plaq, bili, pam, glasgow, cr].map((v) => n(v));
    if (vals.some((v) => v === null)) return null;
    const [vPf, vPlaq, vBili, vPam, vGlasgow, vCr] = vals as number[];
    let s = 0;
    if (vPf < 100) s += 4; else if (vPf < 200) s += 3; else if (vPf < 300) s += 2; else if (vPf < 400) s += 1;
    if (vPlaq < 20) s += 4; else if (vPlaq < 50) s += 3; else if (vPlaq < 100) s += 2; else if (vPlaq < 150) s += 1;
    if (vBili >= 12) s += 4; else if (vBili >= 6) s += 3; else if (vBili >= 3.5) s += 2; else if (vBili >= 1.2) s += 1;
    if (vPam < 70) s += 1;
    if (vGlasgow < 6) s += 4; else if (vGlasgow < 10) s += 3; else if (vGlasgow < 13) s += 2; else if (vGlasgow < 15) s += 1;
    if (vCr >= 5) s += 4; else if (vCr >= 3.5) s += 3; else if (vCr >= 2) s += 2; else if (vCr >= 1.2) s += 1;
    return s;
  }, [pf, plaq, bili, pam, glasgow, cr]);

  const mort = result === null ? "" : result === 0 ? "~0%" : result <= 6 ? "~10%" : result <= 9 ? "~20–40%" : result <= 12 ? "~40–60%" : "~80%+";
  const variant: ResultVariant = result === null ? "info" : result <= 6 ? "success" : result <= 9 ? "warning" : "danger";

  return (
    <CardSection title="SOFA">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "PaO₂/FiO₂", val: pf, set: setPf, ph: "300" },
          { label: "Plaquetas (×10³/μL)", val: plaq, set: setPlaq, ph: "120" },
          { label: "Bilirrubina (mg/dL)", val: bili, set: setBili, ph: "3,5" },
          { label: "PA media (mmHg)", val: pam, set: setPam, ph: "70" },
          { label: "Glasgow (3–15)", val: glasgow, set: setGlasgow, ph: "10" },
          { label: "Creatinina (mg/dL)", val: cr, set: setCr, ph: "2,5" },
        ].map(({ label, val, set, ph }) => (
          <Field key={label} label={label}>
            <input inputMode="decimal" className={INPUT} value={val} onChange={(e) => set(e.target.value)} placeholder={ph} />
          </Field>
        ))}
      </div>
      {result !== null ? (
        <ResultBox value={`${result} pts`} variant={variant} sub={`Mortalidad estimada: ${mort}${result >= 2 ? " · Con sospecha de infección = Sepsis" : ""}`} />
      ) : (
        <p className="text-sm text-slate-500">Completá todos los campos para ver el resultado.</p>
      )}
    </CardSection>
  );
}

/* ── qSOFA ──────────────────────────────────────────────────── */
function QSofa() {
  const [fr, setFr] = useState("0");
  const [glasgow, setGlasgow] = useState("0");
  const [pas, setPas] = useState("0");
  const score = Number(fr) + Number(glasgow) + Number(pas);
  const variant: ResultVariant = score >= 2 ? "danger" : "success";
  return (
    <CardSection title="qSOFA (Sepsis-3)">
      <Field label="FR ≥ 22 rpm"><RadioPair name="qsofa-fr" value={fr} onChange={setFr} /></Field>
      <Field label="Alteración del sensorio (Glasgow < 15)"><RadioPair name="qsofa-g" value={glasgow} onChange={setGlasgow} /></Field>
      <Field label="PAS ≤ 100 mmHg"><RadioPair name="qsofa-pas" value={pas} onChange={setPas} /></Field>
      <ResultBox value={`${score}/3`} variant={variant} sub={score >= 2 ? "RIESGO ALTO de mal pronóstico. Evaluar con SOFA completo." : "Bajo riesgo. No indica sepsis por sí solo."} />
    </CardSection>
  );
}

/* ── GLASGOW ─────────────────────────────────────────────────── */
function GlasgowCalc() {
  const [ocular, setOcular] = useState("4");
  const [verbal, setVerbal] = useState("5");
  const [motora, setMotora] = useState("6");
  const score = Number(ocular) + Number(verbal) + Number(motora);
  const label = score >= 13 ? "Leve (13–15)" : score >= 9 ? "Moderado (9–12)" : "Severo (3–8)";
  const variant: ResultVariant = score >= 13 ? "success" : score >= 9 ? "warning" : "danger";
  const sel = (val: string, set: (v: string) => void, opts: string[][]) => (
    <select className={INPUT} value={val} onChange={(e) => set(e.target.value)}>
      {opts.map(([v, l]) => <option key={v} value={v}>{v} – {l}</option>)}
    </select>
  );
  return (
    <CardSection title="Escala de Glasgow">
      <Field label="Apertura ocular">{sel(ocular, setOcular, [["4","Espontánea"],["3","Al hablar"],["2","Al dolor"],["1","Ninguna"]])}</Field>
      <Field label="Respuesta verbal">{sel(verbal, setVerbal, [["5","Orientado"],["4","Confuso"],["3","Palabras inapropiadas"],["2","Sonidos incomprensibles"],["1","Ninguna"]])}</Field>
      <Field label="Respuesta motora">{sel(motora, setMotora, [["6","Obedece órdenes"],["5","Localiza el dolor"],["4","Retira al dolor"],["3","Flexión anormal"],["2","Extensión anormal"],["1","Ninguna"]])}</Field>
      <ResultBox value={`${score}/15`} variant={variant} sub={label} />
    </CardSection>
  );
}

/* ── NIHSS ───────────────────────────────────────────────────── */
const NIHSS_ITEMS: { key: string; label: string; options: { value: number; text: string }[] }[] = [
  { key: "n1a", label: "1a. Nivel de conciencia", options: [{ value: 0, text: "Alerta" }, { value: 1, text: "No alerta pero despierta con estímulos mínimos" }, { value: 2, text: "Requiere estímulos repetidos o dolorosos" }, { value: 3, text: "Coma / reflejos de decorticación o descerebración" }] },
  { key: "n1b", label: "1b. Preguntas (mes y edad)", options: [{ value: 0, text: "Responde ambas correctamente" }, { value: 1, text: "Responde una correctamente" }, { value: 2, text: "No responde ninguna" }] },
  { key: "n1c", label: "1c. Órdenes (abrir/cerrar ojos, puño)", options: [{ value: 0, text: "Realiza ambas correctamente" }, { value: 1, text: "Realiza una correctamente" }, { value: 2, text: "No realiza ninguna" }] },
  { key: "n2", label: "2. Mirada conjugada", options: [{ value: 0, text: "Normal" }, { value: 1, text: "Parálisis de la mirada parcial" }, { value: 2, text: "Desviación forzada o parálisis total" }] },
  { key: "n3", label: "3. Campos visuales", options: [{ value: 0, text: "Sin pérdida visual" }, { value: 1, text: "Hemianopsia parcial" }, { value: 2, text: "Hemianopsia completa" }, { value: 3, text: "Hemianopsia bilateral (ceguera cortical)" }] },
  { key: "n4", label: "4. Parálisis facial", options: [{ value: 0, text: "Normal, simétrica" }, { value: 1, text: "Parálisis leve" }, { value: 2, text: "Parálisis parcial" }, { value: 3, text: "Parálisis completa" }] },
  { key: "n5a", label: "5a. MMSS izquierda (90° / 10 s)", options: [{ value: 0, text: "No cae, mantiene 10 s" }, { value: 1, text: "Cae antes de 10 s, no golpea la cama" }, { value: 2, text: "Esfuerzo contra la gravedad, no mantiene" }, { value: 3, text: "Sin esfuerzo contra la gravedad" }, { value: 4, text: "Sin movimiento" }] },
  { key: "n5b", label: "5b. MMSS derecha (90° / 10 s)", options: [{ value: 0, text: "No cae, mantiene 10 s" }, { value: 1, text: "Cae antes de 10 s, no golpea la cama" }, { value: 2, text: "Esfuerzo contra la gravedad, no mantiene" }, { value: 3, text: "Sin esfuerzo contra la gravedad" }, { value: 4, text: "Sin movimiento" }] },
  { key: "n6a", label: "6a. MMII izquierda (30° / 5 s)", options: [{ value: 0, text: "No cae, mantiene 5 s" }, { value: 1, text: "Cae antes de 5 s, no golpea la cama" }, { value: 2, text: "Esfuerzo contra la gravedad, no mantiene" }, { value: 3, text: "Sin esfuerzo contra la gravedad" }, { value: 4, text: "Sin movimiento" }] },
  { key: "n6b", label: "6b. MMII derecha (30° / 5 s)", options: [{ value: 0, text: "No cae, mantiene 5 s" }, { value: 1, text: "Cae antes de 5 s, no golpea la cama" }, { value: 2, text: "Esfuerzo contra la gravedad, no mantiene" }, { value: 3, text: "Sin esfuerzo contra la gravedad" }, { value: 4, text: "Sin movimiento" }] },
  { key: "n7", label: "7. Ataxia de extremidades", options: [{ value: 0, text: "Sin ataxia" }, { value: 1, text: "Presente en una extremidad" }, { value: 2, text: "Presente en dos extremidades" }] },
  { key: "n8", label: "8. Sensibilidad", options: [{ value: 0, text: "Normal" }, { value: 1, text: "Pérdida leve a moderada" }, { value: 2, text: "Pérdida grave a total" }] },
  { key: "n9", label: "9. Lenguaje / Afasia", options: [{ value: 0, text: "Normal, sin afasia" }, { value: 1, text: "Afasia leve a moderada" }, { value: 2, text: "Afasia severa" }, { value: 3, text: "Mudo, afasia global" }] },
  { key: "n10", label: "10. Disartria", options: [{ value: 0, text: "Normal" }, { value: 1, text: "Disartria leve a moderada" }, { value: 2, text: "Disartria severa o anartria" }] },
  { key: "n11", label: "11. Extinción e inatención", options: [{ value: 0, text: "Sin inatención" }, { value: 1, text: "Inatención visual, táctil, auditiva o espacial" }, { value: 2, text: "Inatención hemiespacial en más de una modalidad" }] },
];

function Nihss() {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(NIHSS_ITEMS.map((item) => [item.key, 0]))
  );
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const label = total === 0 ? "Sin déficit" : total <= 4 ? "ACV leve" : total <= 15 ? "ACV moderado" : total <= 20 ? "ACV moderado-grave" : "ACV grave";
  const variant: ResultVariant = total === 0 ? "success" : total <= 4 ? "info" : total <= 15 ? "warning" : "danger";
  return (
    <CardSection title="NIHSS — Escala NIH de ACV">
      <div className="space-y-3">
        {NIHSS_ITEMS.map((item) => (
          <div key={item.key} className="rounded-xl bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-700 mb-2">{item.label}</p>
            <div className="space-y-1.5">
              {item.options.map((opt) => (
                <label key={opt.value} className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${scores[item.key] === opt.value ? "bg-teal-50 border-teal-300 text-teal-900 font-medium" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
                  <input type="radio" name={`nihss-${item.key}`} checked={scores[item.key] === opt.value} onChange={() => setScores((prev) => ({ ...prev, [item.key]: opt.value }))} className="sr-only" />
                  <span className="font-bold text-teal-700 w-4 shrink-0">{opt.value}</span>
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="sticky bottom-4 mt-4">
        <ResultBox value={`${total}/42`} variant={variant} sub={label} />
      </div>
    </CardSection>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────── */
export default function ScoresUciPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scores UCI</h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          APACHE II · SOFA · qSOFA · Glasgow · NIHSS
        </p>
      </div>
      <ApacheII />
      <Sofa />
      <QSofa />
      <GlasgowCalc />
      <Nihss />
      <MedicalDisclaimer />
    </div>
  );
}
