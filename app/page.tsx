import Link from "next/link";

const TOOLS = [
  {
    href: "/clearance-creatinina",
    icon: "🫘",
    title: "Clearance de creatinina",
    description: "Cockcroft–Gault y CKD-EPI 2021 con estadificación renal",
  },
  {
    href: "/ajuste-antibioticos",
    icon: "💊",
    title: "Ajuste de antibióticos",
    description: "22 antibióticos con dosis ajustadas por función renal",
  },
  {
    href: "/imc",
    icon: "⚖️",
    title: "Índice de masa corporal",
    description: "IMC con categorías OMS para adultos",
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

      <p className="text-xs text-slate-400">
        Los resultados son orientativos. Verificar siempre con guías locales,
        ficha técnica y criterio clínico del equipo tratante.
      </p>
    </div>
  );
}
