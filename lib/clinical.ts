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

/**
 * CKD-EPI 2021 sin raza. Scr en mg/dL, edad en años.
 * Devuelve mL/min/1.73 m².
 */
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

/**
 * MDRD 4 variables (IDMS-trazable). Scr en mg/dL, edad en años.
 * Devuelve mL/min/1.73 m².
 */
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

// ─── Medio Interno ─────────────────────────────────────────────────────────

export type AcidBasePrimaryType =
  | "normal"
  | "acmet"
  | "alcmet"
  | "acresp"
  | "alcresp"
  | "mixed";

export interface CompensationResult {
  formula: string;
  expected: string;
  status: "adecuada" | "insuficiente" | "excesiva" | "no_aplica";
}

export interface AcidBaseResult {
  primaryDisorder: string;
  primaryType: AcidBasePrimaryType;
  phNormal: boolean;
  compensation: CompensationResult;
  anionGap: number | null;
  anionGapStatus: string;
  deltaRatio: number | null;
  deltaRatioInterp: string;
  aaGradient: number;
  aaGradientExpected: number | null;
  aaGradientStatus: string;
  ebStatus?: string;
  lactateStatus?: string;
  pFRatio?: number;
  pFRatioInterp?: string;
  oxygenationIndex?: number;
  oiInterp?: string;
  drivePressure?: number;
  drivePressureStatus?: string;
}

export function analyzeAcidBase(params: {
  pH: number;
  paCO2: number;
  hco3: number;
  paO2: number;
  fiO2: number;
  na?: number;
  cl?: number;
  age?: number;
  eb?: number;
  lactate?: number;
  ventilated: boolean;
  peep?: number;
  pplat?: number;
}): AcidBaseResult {
  const { pH, paCO2, hco3, paO2, fiO2, na, cl, age, eb, lactate, ventilated, peep, pplat } = params;
  const phNormal = pH >= 7.35 && pH <= 7.45;

  // Primary disorder
  let primaryDisorder: string;
  let primaryType: AcidBasePrimaryType;
  const acidemic = pH < 7.35;
  const alkalemic = pH > 7.45;
  const highCO2 = paCO2 > 45;
  const lowCO2 = paCO2 < 35;
  const lowHCO3 = hco3 < 22;
  const highHCO3 = hco3 > 26;

  if (acidemic) {
    if (highCO2 && lowHCO3) { primaryDisorder = "Trastorno mixto: acidosis respiratoria + metabólica"; primaryType = "mixed"; }
    else if (highCO2) { primaryDisorder = "Acidosis respiratoria"; primaryType = "acresp"; }
    else if (lowHCO3) { primaryDisorder = "Acidosis metabólica"; primaryType = "acmet"; }
    else { primaryDisorder = "Acidemia (patrón inespecífico)"; primaryType = "normal"; }
  } else if (alkalemic) {
    if (lowCO2 && highHCO3) { primaryDisorder = "Trastorno mixto: alcalosis respiratoria + metabólica"; primaryType = "mixed"; }
    else if (lowCO2) { primaryDisorder = "Alcalosis respiratoria"; primaryType = "alcresp"; }
    else if (highHCO3) { primaryDisorder = "Alcalosis metabólica"; primaryType = "alcmet"; }
    else { primaryDisorder = "Alcalemia (patrón inespecífico)"; primaryType = "normal"; }
  } else {
    if (!ventilated && highCO2 && highHCO3) { primaryDisorder = "pH normal — probable acidosis respiratoria crónica compensada"; primaryType = "acresp"; }
    else if (!ventilated && lowCO2 && lowHCO3) { primaryDisorder = "pH normal — probable alcalosis respiratoria crónica compensada"; primaryType = "alcresp"; }
    else { primaryDisorder = "Sin trastorno ácido-base primario"; primaryType = "normal"; }
  }

  // Compensation
  let compensation: CompensationResult;
  if (primaryType === "acmet") {
    const expCO2 = 1.5 * hco3 + 8;
    const lo = +(expCO2 - 2).toFixed(1);
    const hi = +(expCO2 + 2).toFixed(1);
    const ok = paCO2 >= lo && paCO2 <= hi;
    const above = paCO2 > hi;
    compensation = {
      formula: "Fórmula de Winter: PaCO₂ = 1,5 × HCO₃ + 8 (±2)",
      expected: ok
        ? `Esperado: ${lo}–${hi} mmHg · Actual: ${paCO2} ✓ Adecuada`
        : above
        ? `Esperado: ${lo}–${hi} mmHg · Actual: ${paCO2} → acidosis respiratoria sobreagregada`
        : `Esperado: ${lo}–${hi} mmHg · Actual: ${paCO2} → alcalosis respiratoria sobreagregada`,
      status: ok ? "adecuada" : above ? "insuficiente" : "excesiva",
    };
  } else if (primaryType === "alcmet") {
    const expCO2 = 40 + 0.7 * (hco3 - 24);
    const lo = +(expCO2 - 5).toFixed(1);
    const hi = +(expCO2 + 5).toFixed(1);
    const ok = paCO2 >= lo && paCO2 <= hi;
    const above = paCO2 > hi;
    compensation = {
      formula: "PaCO₂ = 40 + 0,7 × (HCO₃ – 24) (±5)",
      expected: ok
        ? `Esperado: ${lo}–${hi} mmHg · Actual: ${paCO2} ✓ Adecuada`
        : above
        ? `Esperado: ${lo}–${hi} mmHg · Actual: ${paCO2} → acidosis respiratoria sobreagregada`
        : `Esperado: ${lo}–${hi} mmHg · Actual: ${paCO2} → alcalosis respiratoria sobreagregada`,
      status: ok ? "adecuada" : above ? "insuficiente" : "excesiva",
    };
  } else if (primaryType === "acresp") {
    const delta = paCO2 - 40;
    const aHCO3 = +(24 + 0.1 * delta).toFixed(1);
    const cHCO3 = +(24 + 0.35 * delta).toFixed(1);
    let note: string; let status: CompensationResult["status"];
    if (hco3 >= aHCO3 - 3 && hco3 <= aHCO3 + 3) { note = "compatible con compensación aguda ✓"; status = "adecuada"; }
    else if (hco3 >= cHCO3 - 3 && hco3 <= cHCO3 + 3) { note = "compatible con compensación crónica ✓"; status = "adecuada"; }
    else if (hco3 > cHCO3 + 3) { note = "HCO₃ elevado → alcalosis metabólica sobreagregada"; status = "excesiva"; }
    else { note = "HCO₃ insuficiente → posible acidosis metabólica sobreagregada"; status = "insuficiente"; }
    compensation = { formula: "HCO₃ esperado: aguda = 24+0,1×ΔPaCO₂ · crónica = 24+0,35×ΔPaCO₂", expected: `Aguda: ~${aHCO3} · Crónica: ~${cHCO3} mEq/L · Actual: ${hco3} — ${note}`, status };
  } else if (primaryType === "alcresp") {
    const delta = 40 - paCO2;
    const aHCO3 = +(24 - 0.2 * delta).toFixed(1);
    const cHCO3 = +(24 - 0.5 * delta).toFixed(1);
    let note: string; let status: CompensationResult["status"];
    if (hco3 >= aHCO3 - 3 && hco3 <= aHCO3 + 3) { note = "compatible con compensación aguda ✓"; status = "adecuada"; }
    else if (hco3 >= cHCO3 - 3 && hco3 <= cHCO3 + 3) { note = "compatible con compensación crónica ✓"; status = "adecuada"; }
    else if (hco3 < cHCO3 - 3) { note = "HCO₃ bajo → acidosis metabólica sobreagregada"; status = "insuficiente"; }
    else { note = "HCO₃ elevado → alcalosis metabólica sobreagregada"; status = "excesiva"; }
    compensation = { formula: "HCO₃ esperado: aguda = 24−0,2×ΔPaCO₂ · crónica = 24−0,5×ΔPaCO₂", expected: `Aguda: ~${aHCO3} · Crónica: ~${cHCO3} mEq/L · Actual: ${hco3} — ${note}`, status };
  } else {
    compensation = { formula: "—", expected: "No aplica", status: "no_aplica" };
  }

  // Anion gap
  let anionGap: number | null = null;
  let anionGapStatus: string;
  if (na !== undefined && !isNaN(na) && cl !== undefined && !isNaN(cl)) {
    anionGap = na - (cl + hco3);
    anionGapStatus = anionGap > 12
      ? `${anionGap.toFixed(1)} mEq/L — elevado → acidosis de alto anion gap`
      : `${anionGap.toFixed(1)} mEq/L — normal (8–12 mEq/L)`;
  } else {
    anionGapStatus = "Ingresar Na⁺ y Cl⁻ para calcular";
  }

  // Delta-delta
  let deltaRatio: number | null = null;
  let deltaRatioInterp: string;
  if (anionGap !== null && anionGap > 12) {
    const denom = 24 - hco3;
    if (denom !== 0) {
      deltaRatio = (anionGap - 12) / denom;
      if (deltaRatio < 0.4) deltaRatioInterp = `${deltaRatio.toFixed(2)} — Acidosis no aniónica pura`;
      else if (deltaRatio < 1.0) deltaRatioInterp = `${deltaRatio.toFixed(2)} — Mixto: aniónica + no aniónica`;
      else if (deltaRatio <= 2.0) deltaRatioInterp = `${deltaRatio.toFixed(2)} — Acidosis aniónica pura`;
      else deltaRatioInterp = `${deltaRatio.toFixed(2)} — Acidosis aniónica + alcalosis metabólica`;
    } else { deltaRatioInterp = "HCO₃ = 24 (denominador cero)"; }
  } else if (anionGap !== null) {
    deltaRatioInterp = "No aplica — anion gap normal";
  } else {
    deltaRatioInterp = "Requiere cálculo de anion gap";
  }

  // A-a gradient
  const pAO2 = fiO2 * 713 - paCO2 / 0.8;
  const aaGradient = pAO2 - paO2;
  let aaGradientExpected: number | null = null;
  let aaGradientStatus: string;
  if (age !== undefined && !isNaN(age) && age > 0) {
    aaGradientExpected = age / 4 + 4;
    const upper = aaGradientExpected + 10;
    aaGradientStatus = aaGradient <= upper
      ? `Normal para la edad (≤${upper.toFixed(0)} mmHg)`
      : "Elevado — sugiere patología intrapulmonar";
  } else {
    aaGradientStatus = aaGradient <= 15 ? "Normal (< 15 mmHg en adulto joven)" : "Elevado — sugiere patología intrapulmonar";
  }

  // EB
  let ebStatus: string | undefined;
  if (eb !== undefined && !isNaN(eb)) {
    if (eb >= -2 && eb <= 2) ebStatus = `Normal (${eb >= 0 ? "+" : ""}${eb} mEq/L)`;
    else if (eb < -2) ebStatus = `Déficit de bases (${eb} mEq/L) — acidosis metabólica`;
    else ebStatus = `Exceso de bases (+${eb} mEq/L) — alcalosis metabólica`;
  }

  // Lactate
  let lactateStatus: string | undefined;
  if (lactate !== undefined && !isNaN(lactate)) {
    if (lactate < 2) lactateStatus = `Normal (${lactate} mmol/L)`;
    else if (lactate < 4) lactateStatus = `Hiperlactatemia moderada (${lactate} mmol/L)`;
    else lactateStatus = `Hiperlactatemia severa — hipoperfusión/shock (${lactate} mmol/L)`;
  }

  // Ventilated-only
  let pFRatio: number | undefined;
  let pFRatioInterp: string | undefined;
  let oxygenationIndex: number | undefined;
  let oiInterp: string | undefined;
  let drivePressure: number | undefined;
  let drivePressureStatus: string | undefined;

  if (ventilated) {
    pFRatio = paO2 / fiO2;
    if (pFRatio > 300) pFRatioInterp = "Sin criterios de SDRA (> 300)";
    else if (pFRatio > 200) pFRatioInterp = "SDRA leve — Berlín (200–300, PEEP ≥ 5)";
    else if (pFRatio > 100) pFRatioInterp = "SDRA moderado — Berlín (100–200, PEEP ≥ 5)";
    else pFRatioInterp = "SDRA grave — Berlín (≤ 100, PEEP ≥ 5)";

    if (peep !== undefined && pplat !== undefined && !isNaN(peep) && !isNaN(pplat)) {
      drivePressure = pplat - peep;
      drivePressureStatus = drivePressure < 15
        ? "Protector (< 15 cmH₂O)"
        : "Elevado — riesgo de VILI (≥ 15 cmH₂O)";
      const map = peep + drivePressure / 3;
      oxygenationIndex = (fiO2 * 100 * map) / paO2;
      if (oxygenationIndex < 5) oiInterp = "Normal (< 5)";
      else if (oxygenationIndex < 10) oiInterp = "SDRA leve (5–10)";
      else if (oxygenationIndex < 20) oiInterp = "SDRA moderado (10–20)";
      else oiInterp = "SDRA grave (≥ 20)";
    }
  }

  return {
    primaryDisorder, primaryType, phNormal, compensation,
    anionGap, anionGapStatus, deltaRatio, deltaRatioInterp,
    aaGradient, aaGradientExpected, aaGradientStatus,
    ebStatus, lactateStatus,
    pFRatio, pFRatioInterp, oxygenationIndex, oiInterp,
    drivePressure, drivePressureStatus,
  };
}

export type RifleKdigoStage = "sin_ira" | "estadio1" | "estadio2" | "estadio3";

export function classifyRifleKdigo(params: {
  baseCr: number;
  actualCr: number;
  urineVolumeMl?: number;
  weightKg?: number;
  hoursUrine?: number;
}): { rifle: string; kdigo: string; stage: RifleKdigoStage } {
  const { baseCr, actualCr, urineVolumeMl, weightKg, hoursUrine = 6 } = params;
  const ratio = actualCr / baseCr;
  const urineRate =
    urineVolumeMl && weightKg
      ? urineVolumeMl / hoursUrine / weightKg
      : undefined;

  if (ratio >= 3 || actualCr >= 4 || (urineRate !== undefined && urineRate < 0.3)) {
    return { rifle: "Falla (F)", kdigo: "Estadio 3", stage: "estadio3" };
  }
  if (ratio >= 2 || (urineRate !== undefined && urineRate < 0.5 && hoursUrine >= 12)) {
    return { rifle: "Injuria (I)", kdigo: "Estadio 2", stage: "estadio2" };
  }
  if (ratio >= 1.5 || (urineRate !== undefined && urineRate < 0.5)) {
    return { rifle: "Riesgo (R)", kdigo: "Estadio 1", stage: "estadio1" };
  }
  return { rifle: "Sin injuria renal aguda", kdigo: "Sin IRA", stage: "sin_ira" };
}
