export type RenalBand = "normal" | "moderate" | "severe" | "anuria";

export function renalBandFromCrCl(crCl: number): RenalBand {
  if (crCl >= 60) return "normal";
  if (crCl >= 30) return "moderate";
  if (crCl >= 10) return "severe";
  return "anuria";
}

export const BAND_LABELS: Record<RenalBand, string> = {
  normal: "Conservada (≥60 mL/min)",
  moderate: "Moderada (30–59 mL/min)",
  severe: "Severa (10–29 mL/min)",
  anuria: "Anuria / Diálisis (<10 mL/min)",
};

export const BAND_COLORS: Record<RenalBand, string> = {
  normal: "bg-green-50 border-green-200 text-green-900",
  moderate: "bg-yellow-50 border-yellow-200 text-yellow-900",
  severe: "bg-orange-50 border-orange-200 text-orange-900",
  anuria: "bg-red-50 border-red-200 text-red-900",
};

export interface AntibioticEntry {
  id: string;
  label: string;
  group: string;
  doses: Record<RenalBand, string>;
  /** Dosis de refuerzo a administrar al finalizar cada sesión de hemodiálisis */
  dialysisSupplement?: string;
  note: string;
}

export const ANTIBIOTICS: AntibioticEntry[] = [
  {
    id: "pip-tazo",
    label: "Piperacilina-Tazobactam",
    group: "Penicilinas",
    doses: {
      normal: "4,5 g IV c/6 h",
      moderate: "2,25 g IV c/6 h",
      severe: "2,25 g IV c/8 h",
      anuria: "2,25 g IV c/12 h",
    },
    dialysisSupplement: "0,75 g IV luego de cada sesión de HD",
    note: "Máx ~16 g/día de piperacilina. Ajustar según foco e indicación.",
  },
  {
    id: "ampi-sulbactam",
    label: "Ampicilina-Sulbactam",
    group: "Penicilinas",
    doses: {
      normal: "3 g IV c/6 h",
      moderate: "3 g IV c/6 h",
      severe: "3 g IV c/8 h",
      anuria: "3 g IV c/12 h",
    },
    dialysisSupplement: "3 g IV al finalizar cada sesión de HD",
    note: "Cobertura anaeróbica limitada vs B. fragilis. Vigilar hepatotoxicidad y rash.",
  },
  {
    id: "meropenem",
    label: "Meropenem",
    group: "Carbapenems",
    doses: {
      normal: "1–2 g IV c/8 h",
      moderate: "1 g IV c/8 h",
      severe: "500 mg IV c/8 h",
      anuria: "500 mg IV c/12 h",
    },
    dialysisSupplement: "500 mg IV luego de cada sesión de HD",
    note: "Meningitis: 2 g c/8 h (no reducir). No reducir en infecciones graves si ClCr ≥30.",
  },
  {
    id: "imipenem",
    label: "Imipenem-Cilastatina",
    group: "Carbapenems",
    doses: {
      normal: "500 mg IV c/6 h",
      moderate: "500 mg IV c/6 h",
      severe: "500 mg IV c/8 h",
      anuria: "250 mg IV c/12 h",
    },
    dialysisSupplement: "250 mg IV luego de cada sesión de HD",
    note: "Máx 4 g/día. Umbral convulsivo bajo; usar con precaución en SNC.",
  },
  {
    id: "ertapenem",
    label: "Ertapenem",
    group: "Carbapenems",
    doses: {
      normal: "1 g IV/IM c/24 h",
      moderate: "1 g IV c/24 h",
      severe: "500 mg IV c/24 h",
      anuria: "500 mg IV c/24 h",
    },
    dialysisSupplement: "150 mg IV luego de sesión de HD el mismo día de la dosis",
    note: "No cubre Pseudomonas ni Enterococcus. Útil en BLEE de foco abdominal/urinario.",
  },
  {
    id: "ceftriaxona",
    label: "Ceftriaxona",
    group: "Cefalosporinas",
    doses: {
      normal: "1–2 g IV c/24 h",
      moderate: "1–2 g IV c/24 h",
      severe: "1 g IV c/24 h",
      anuria: "1 g IV c/24 h",
    },
    note: "Sin ajuste renal significativo. Escasa eliminación por HD; no requiere dosis de refuerzo. Precaución: pseudolitiasis biliar, hipoprotrombinemia.",
  },
  {
    id: "cefepima",
    label: "Cefepima",
    group: "Cefalosporinas",
    doses: {
      normal: "2 g IV c/8–12 h",
      moderate: "2 g IV c/12 h",
      severe: "1 g IV c/24 h",
      anuria: "1 g IV c/24 h",
    },
    dialysisSupplement: "1 g IV luego de cada sesión de HD",
    note: "Neurotoxicidad (encefalopatía) a dosis altas con IRC: vigilar.",
  },
  {
    id: "ceftazidima",
    label: "Ceftazidima",
    group: "Cefalosporinas",
    doses: {
      normal: "2 g IV c/8 h",
      moderate: "2 g IV c/12 h",
      severe: "1 g IV c/24 h",
      anuria: "1 g IV c/48 h",
    },
    dialysisSupplement: "1 g IV luego de cada sesión de HD",
    note: "Cubre Pseudomonas. No reducir en fibrosis quística.",
  },
  {
    id: "vancomicina",
    label: "Vancomicina",
    group: "Glucopéptidos",
    doses: {
      normal: "15–20 mg/kg IV c/8–12 h (carga: 25–30 mg/kg)",
      moderate: "15 mg/kg IV c/24 h",
      severe: "15 mg/kg IV c/48–72 h",
      anuria: "Según TDM — no usar sin monitoreo de niveles",
    },
    dialysisSupplement: "500 mg–1 g IV post-HD (o según nivel post-sesión; objetivo trough >10 mg/L)",
    note: "Objetivo AUC 400–600 mg·h/L (o trough 15–20 mg/L). TDM obligatorio.",
  },
  {
    id: "gentamicina",
    label: "Gentamicina",
    group: "Aminoglucósidos",
    doses: {
      normal: "5–7 mg/kg IV c/24 h",
      moderate: "3–5 mg/kg IV c/36 h",
      severe: "2–3 mg/kg IV c/48 h",
      anuria: "Evitar o usar con TDM estricto",
    },
    dialysisSupplement: "Dosis única post-HD según nivel (pico post-HD <1 mg/L antes de reiniciar)",
    note: "TDM: pico 20–30, valle <2 mg/L. Nefro y ototóxico.",
  },
  {
    id: "amikacina",
    label: "Amikacina",
    group: "Aminoglucósidos",
    doses: {
      normal: "15–20 mg/kg IV c/24 h",
      moderate: "7,5 mg/kg IV c/24 h",
      severe: "7,5 mg/kg IV c/48 h",
      anuria: "Evitar o usar con TDM estricto",
    },
    dialysisSupplement: "Dosis única post-HD según nivel (valle <10 mg/L antes de reiniciar)",
    note: "TDM: pico 50–70, valle <10 mg/L. Reservar para MDR.",
  },
  {
    id: "ciprofloxacino",
    label: "Ciprofloxacino",
    group: "Fluoroquinolonas",
    doses: {
      normal: "400 mg IV c/12 h o 500–750 mg VO c/12 h",
      moderate: "400 mg IV c/12 h",
      severe: "400 mg IV c/24 h",
      anuria: "400 mg IV c/24 h",
    },
    note: "Cubre Pseudomonas. Escasa eliminación por HD; no requiere dosis de refuerzo rutinaria. Precaución: tendinitis, prolongación QT.",
  },
  {
    id: "levofloxacino",
    label: "Levofloxacino",
    group: "Fluoroquinolonas",
    doses: {
      normal: "750 mg VO/IV c/24 h",
      moderate: "750 mg carga, luego 500 mg c/24 h",
      severe: "750 mg carga, luego 500 mg c/48 h",
      anuria: "750 mg carga, luego 500 mg c/48 h",
    },
    note: "Mejor cobertura antineumocócica. Escasa eliminación por HD; no requiere dosis de refuerzo. Precaución: QT, tendinitis.",
  },
  {
    id: "metronidazol",
    label: "Metronidazol",
    group: "Nitroimidazoles",
    doses: {
      normal: "500 mg IV c/8 h",
      moderate: "500 mg IV c/8 h",
      severe: "500 mg IV c/12 h",
      anuria: "250 mg IV c/12 h",
    },
    dialysisSupplement: "500 mg IV luego de cada sesión de HD",
    note: "Sin ajuste renal mayor. Cobertura anaeróbica excelente.",
  },
  {
    id: "linezolid",
    label: "Linezolid",
    group: "Oxazolidinonas",
    doses: {
      normal: "600 mg IV/VO c/12 h",
      moderate: "600 mg IV/VO c/12 h",
      severe: "600 mg IV/VO c/12 h",
      anuria: "600 mg IV/VO c/12 h",
    },
    note: "Sin ajuste renal. Mínima eliminación por HD; no requiere dosis de refuerzo. Mielosupresión con uso >14 días. Interacción serotoninérgica.",
  },
  {
    id: "daptomicina",
    label: "Daptomicina",
    group: "Lipopéptidos",
    doses: {
      normal: "6–10 mg/kg IV c/24 h",
      moderate: "6 mg/kg IV c/48 h",
      severe: "6 mg/kg IV c/48 h",
      anuria: "6 mg/kg IV c/72 h",
    },
    dialysisSupplement: "Programar dosis post-HD en días de diálisis (HD elimina ~50% de la dosis)",
    note: "Inactiva en neumonía (inactivada por surfactante). Monitorear CPK.",
  },
  {
    id: "tigeciclina",
    label: "Tigeciclina",
    group: "Glicilciclinas",
    doses: {
      normal: "100 mg IV carga, luego 50 mg c/12 h",
      moderate: "100 mg IV carga, luego 50 mg c/12 h",
      severe: "100 mg IV carga, luego 50 mg c/12 h",
      anuria: "100 mg IV carga, luego 50 mg c/12 h",
    },
    note: "Sin ajuste renal. Mínima eliminación por HD; no requiere dosis de refuerzo. Asociada a mayor mortalidad vs otros ATB en metaanálisis.",
  },
  {
    id: "colistina",
    label: "Colistina (Polimixina E)",
    group: "Polimixinas",
    doses: {
      normal: "2,5 mg/kg (CBA) IV c/12 h",
      moderate: "2,5 mg/kg (CBA) IV c/12 h",
      severe: "1,5 mg/kg (CBA) IV c/12 h",
      anuria: "1 mg/kg (CBA) IV c/12 h",
    },
    dialysisSupplement: "Variable según TDM; aproximadamente 1 mg/kg (CBA) post-HD",
    note: "TDM recomendado. Nefro y neurotóxico. Solo para MDR sin alternativas.",
  },
  {
    id: "fluconazol",
    label: "Fluconazol",
    group: "Antifúngicos",
    doses: {
      normal: "400–800 mg IV/VO c/24 h",
      moderate: "200–400 mg IV c/24 h",
      severe: "200 mg IV c/48 h",
      anuria: "200 mg IV c/72 h",
    },
    dialysisSupplement: "200 mg IV luego de cada sesión de HD",
    note: "Candidiasis invasiva: 400 mg/día. Meningitis criptocócica: 800 mg/día.",
  },
  {
    id: "voriconazol",
    label: "Voriconazol",
    group: "Antifúngicos",
    doses: {
      normal: "6 mg/kg IV c/12 h ×2, luego 4 mg/kg c/12 h",
      moderate: "6 mg/kg IV c/12 h ×2, luego 4 mg/kg c/12 h",
      severe: "Preferir vía oral (vehículo IV acumula)",
      anuria: "Preferir vía oral (vehículo IV acumula)",
    },
    note: "TDM obligatorio (objetivo 1–5,5 mg/L). Vía oral preferible en diálisis (vehículo IV se acumula). Mínima eliminación por HD; no requiere dosis de refuerzo. Hepatotóxico; vigilar visión.",
  },
  {
    id: "anfotericina-b",
    label: "Anfotericina B liposomal",
    group: "Antifúngicos",
    doses: {
      normal: "3–5 mg/kg IV c/24 h",
      moderate: "3–5 mg/kg IV c/24 h",
      severe: "3 mg/kg IV c/24 h",
      anuria: "3 mg/kg IV c/24 h",
    },
    note: "Nefrotóxica: prehidratación obligatoria. Mínima eliminación por HD; no requiere dosis de refuerzo. Monitorear K⁺, Mg²⁺ y creatinina.",
  },
  {
    id: "aciclovir",
    label: "Aciclovir",
    group: "Antivirales",
    doses: {
      normal: "10 mg/kg IV c/8 h (HSV) / 15 mg/kg c/8 h (VZV)",
      moderate: "10 mg/kg IV c/12 h",
      severe: "10 mg/kg IV c/24 h",
      anuria: "5 mg/kg IV c/24 h",
    },
    dialysisSupplement: "5 mg/kg IV luego de cada sesión de HD",
    note: "Hidratar bien para evitar cristaluria. Vigilar neurotoxicidad.",
  },
];

export const ANTIBIOTIC_GROUPS = [
  ...new Set(ANTIBIOTICS.map((a) => a.group)),
];
