/** IMC en kg/m² */
export function computeBmiKgM2(weightKg: number, heightM: number): number {
  if (heightM <= 0 || weightKg <= 0) return NaN;
  return weightKg / (heightM * heightM);
}

export function bmiCategoryEs(bmi: number): string {
  if (Number.isNaN(bmi)) return "—";
  if (bmi < 18.5) return "Bajo peso";
  if (bmi < 25) return "Normopeso";
  if (bmi < 30) return "Sobrepeso";
  if (bmi < 35) return "Obesidad grado I";
  if (bmi < 40) return "Obesidad grado II";
  return "Obesidad grado III (mórbida)";
}

export function cockcroftGaultMlMin(params: {
  ageYears: number;
  weightKg: number;
  scrMgDl: number;
  female: boolean;
}): number {
  const { ageYears, weightKg, scrMgDl, female } = params;
  if (ageYears <= 0 || weightKg <= 0 || scrMgDl <= 0) return NaN;
  const base = ((140 - ageYears) * weightKg) / (72 * scrMgDl);
  return female ? base * 0.85 : base;
}

export function ckdEpi2021(params: {
  ageYears: number;
  scrMgDl: number;
  female: boolean;
}): number {
  const { ageYears, scrMgDl, female } = params;
  if (ageYears <= 0 || scrMgDl <= 0) return NaN;
  const k = female ? 0.7 : 0.9;
  const alpha = female ? -0.241 : -0.302;
  const ratio = scrMgDl / k;
  const base =
    142 *
    Math.pow(Math.min(ratio, 1), alpha) *
    Math.pow(Math.max(ratio, 1), -1.2) *
    Math.pow(0.9938, ageYears);
  return female ? base * 1.012 : base;
}

export function mdrd4(params: {
  ageYears: number;
  scrMgDl: number;
  female: boolean;
  blackRace: boolean;
}): number {
  const { ageYears, scrMgDl, female, blackRace } = params;
  if (ageYears <= 0 || scrMgDl <= 0) return NaN;
  let tfg = 175 * Math.pow(scrMgDl, -1.154) * Math.pow(ageYears, -0.203);
  if (female) tfg *= 0.742;
  if (blackRace) tfg *= 1.212;
  return tfg;
}

export type EgfrStage = "G1" | "G2" | "G3a" | "G3b" | "G4" | "G5";

export function egfrStage(egfr: number): EgfrStage {
  if (egfr >= 90) return "G1";
  if (egfr >= 60) return "G2";
  if (egfr >= 45) return "G3a";
  if (egfr >= 30) return "G3b";
  if (egfr >= 15) return "G4";
  return "G5";
}

export function egfrStageLabel(stage: EgfrStage): string {
  const labels: Record<EgfrStage, string> = {
    G1: "Normal o alta (≥90)",
    G2: "Levemente disminuida (60–89)",
    G3a: "Moderada leve (45–59)",
    G3b: "Moderada grave (30–44)",
    G4: "Severa (15–29)",
    G5: "Terminal (<15)",
  };
  return labels[stage];
}
