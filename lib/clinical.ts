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
  return "Obesidad";
}

/**
 * Cockcroft–Gault (adultos). Scr en mg/dL, peso kg, edad años.
 * Devuelve mL/min (no normalizado a 1,73 m²).
 */
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
