export type AntibioticId =
  | "amoxicilina"
  | "amoxi_clavulanico"
  | "cefazolina"
  | "ceftriaxona"
  | "ciprofloxacino"
  | "levofloxacino"
  | "piptazo"
  | "meropenem"
  | "vancomicina";

export const ANTIBIOTIC_OPTIONS: { id: AntibioticId; label: string }[] = [
  { id: "amoxicilina", label: "Amoxicilina" },
  { id: "amoxi_clavulanico", label: "Amoxicilina–ácido clavulánico" },
  { id: "cefazolina", label: "Cefazolina" },
  { id: "ceftriaxona", label: "Ceftriaxona" },
  { id: "ciprofloxacino", label: "Ciprofloxacino" },
  { id: "levofloxacino", label: "Levofloxacino" },
  { id: "piptazo", label: "Piperacilina–tazobactam" },
  { id: "meropenem", label: "Meropenem" },
  { id: "vancomicina", label: "Vancomicina" },
];

/**
 * Textos educativos muy resumidos. Las dosis concretas dependen de indicación,
 * vía, peso, edad, niveles séricos y ficha técnica vigente en tu jurisdicción.
 */
export function renalGuidanceEs(
  id: AntibioticId,
  crClMlMin: number,
): { title: string; bullets: string[] } {
  const gte50 = crClMlMin >= 50;
  const gte30 = crClMlMin >= 30;
  const gte15 = crClMlMin >= 15;

  const band =
    crClMlMin <= 0 || Number.isNaN(crClMlMin)
      ? "sin_datos"
      : gte50
        ? ">=50"
        : gte30
          ? "30_49"
          : gte15
            ? "15_29"
            : "<15";

  const prefix =
    "Esto es orientación general; confirma siempre con guía local y ficha técnica.";

  switch (id) {
    case "amoxicilina":
      return {
        title: "Amoxicilina",
        bullets: [
          prefix,
          "En función renal conservada suele tolerarse bien.",
          band === "30_49" || band === "15_29" || band === "<15"
            ? "Con depuración reducida puede ser necesario espaciar dosis o reducir frecuencia según indicación y referencias."
            : "Sin ajustes habituales salvo situaciones extremas según criterio clínico.",
        ],
      };
    case "amoxi_clavulanico":
      return {
        title: "Amoxicilina–ácido clavulánico",
        bullets: [
          prefix,
          "El componente clavulánico acumula con mayor facilidad si la depuración cae.",
          band === "30_49"
            ? "Valorar reducción de frecuencia o formulaciones alternativas según guía."
            : band === "15_29" || band === "<15"
              ? "Suele recomendarse cautela importante: ajuste de intervalo/dosis o cambio de esquema según protocolo."
              : "Esquema estándar en depuración conservada.",
        ],
      };
    case "cefazolina":
      return {
        title: "Cefazolina",
        bullets: [
          prefix,
          "Muchos esquemas mantienen intervalos similares con depuración leve-moderada.",
          band === "15_29" || band === "<15"
            ? "Puede requerirse extensión del intervalo entre dosis o reducción según indicación y fuente consultada."
            : "Ajuste habitualmente modesto si la depuración es ≥30 mL/min.",
        ],
      };
    case "ceftriaxona":
      return {
        title: "Ceftriaxona",
        bullets: [
          prefix,
          "En adultos con función renal estable, los ajustes por creatinina suelen ser menos críticos que con otras cefalosporinas.",
          "Precaución acumulativa si hay comorbilidad hepática o coadministración con fármacos competidores de secreción tubular.",
        ],
      };
    case "ciprofloxacino":
      return {
        title: "Ciprofloxacino",
        bullets: [
          prefix,
          band === "30_49"
            ? "Con frecuencia se recomienda reducir dosis total diaria o espaciar administraciones."
            : band === "15_29" || band === "<15"
              ? "Suele requerirse reducción marcada o intervalos más largos; revisar ficha técnica."
              : "Dosis habituales en depuración conservada.",
        ],
      };
    case "levofloxacino":
      return {
        title: "Levofloxacino",
        bullets: [
          prefix,
          !gte50
            ? "Los ajustes por CrCl son habituales: menor dosis diaria o intervalos más largos según tabla del fabricante."
            : "En depuración ≥50 mL/min suele emplearse pauta estándar para la mayoría de indicaciones.",
        ],
      };
    case "piptazo":
      return {
        title: "Piperacilina–tazobactam",
        bullets: [
          prefix,
          band === "30_49"
            ? "A menudo se extiende el intervalo entre dosis respecto a la pauta estándar."
            : band === "15_29" || band === "<15"
              ? "Suele requerirse intervalo más largo o dosis reducida; confirma con guía de hospital y ficha técnica."
              : "Pautas estándar de intervalo en depuración ≥40–50 mL/min según referencia.",
        ],
      };
    case "meropenem":
      return {
        title: "Meropenem",
        bullets: [
          prefix,
          band === "15_29" || band === "<15"
            ? "Frecuente prolongar intervalo entre dosis o reducir dosis diaria total."
            : "Con depuración ≥30–50 mL/min muchas pautas se acercan a lo estándar según indicación.",
        ],
      };
    case "vancomicina":
      return {
        title: "Vancomicina",
        bullets: [
          prefix,
          "El ajuste se basa preferentemente en niveles (trough) y función renal dinámica, no solo en una fórmula aislada.",
          "En insuficiencia renal o riesgo de acumulación, monitorización estrecha y protocolo de farmacia clínica.",
        ],
      };
    default:
      return { title: "—", bullets: [prefix] };
  }
}
