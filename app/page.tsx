import Link from "next/link";

const TOOLS = [
  {
    href: "/clearance-creatinina",
    icon: "🫘",
    title: "Función renal",
    description: "Cockcroft–Gault, CKD-EPI 2021 y MDRD con estadificación",
  },
  {
    href: "/ajuste-antibioticos",
    icon: "💊",
    title: "Antibióticos",
    description: "22 antibióticos con dosis ajustadas por función renal",
  },
  {
    href: "/scores-uci",
    icon: "🏥",
    title: "Scores UCI",
    description: "APACHE II, SOFA, qSOFA, Glasgow, NIHSS",
  },
  {
    href: "/infectologia",
    icon: "🦠",
    title: "Infectología",
    description: "CURB-65 para neumonía · Sepsis-3",
  },
  {
    href: "/cardiovascular",
    icon: "❤️",
    title: "Cardiovascular",
    description: "CHA₂DS₂-VASc, HAS-BLED, Killip-Kimball",
  },
  {
    href: "/nutricion",
    icon: "🍎",
    title: "Nutrición",
    description: "Peso ideal (Broca) · Gasto energético (Harris-Benedict)",
  },
  {
    href: "/respiratorio",
    icon: "🫁",
    title: "Respiratorio",
    description: "Relación PaO₂/FiO₂ · Criterios de Berlín (SDRA)",
  },
  {
    href: "/nefrologia",
    icon: "💧",
    title: "Nefrología",
    description: "RIFLE/KDIGO · Anion gap · Osmolaridad · Gradiente A-a",
  },
  {
    href: "/imc",
    icon: "⚖️",
    title: "IMC",
    description: "Índice de masa corporal con categorías OMS",
  },
  {
    href: "/medio-interno",
    icon: "💨",
    title: "Medio Interno",
    description: "Gasometría · Ácido-base · Anion gap · P/F · Índice de oxigenación",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">MedTools Guardia</h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Calculadoras clínicas en español, diseñadas para el trabajo en guardia.
          Uso exclusivamente educativo — no reemplaza el criterio médico.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition-all"
          >
            <span className="text-3xl">{tool.icon}</span>
            <h2 className="mt-3 font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
              {tool.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">Novedades</h2>
        <ul className="space-y-3">
          <li className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Nuevo módulo</span>
            <p className="mt-1 text-sm font-semibold text-slate-800">Medio Interno — Análisis gasométrico completo</p>
            <p className="mt-0.5 text-sm text-slate-600">
              Análisis ácido-base para pacientes ventilados y no ventilados: gasometría arterial,
              gradiente A-a, índice de oxigenación, compensaciones esperadas y más.
            </p>
          </li>
          <li className="rounded-2xl border border-slate-200 bg-white p-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Actualización</span>
            <p className="mt-1 text-sm font-semibold text-slate-800">Antibióticos — Correcciones en dosis de diálisis</p>
            <p className="mt-0.5 text-sm text-slate-600">
              Correcciones en el ajuste de antibióticos para pacientes en diálisis, con dosis
              actualizadas según modalidad de reemplazo renal.
            </p>
          </li>
        </ul>
      </div>

      <p className="text-xs text-slate-400">
        Los resultados son orientativos. Verificar siempre con guías locales,
        ficha técnica y criterio clínico del equipo tratante.
      </p>
    </div>
  );
}
