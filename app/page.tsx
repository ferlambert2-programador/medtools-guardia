import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "MedTools Guardia: calculadoras médicas en español para la práctica diaria. IMC, clearance de creatinina y ajuste orientativo de antibióticos.",
};

const tools = [
  {
    href: "/imc",
    title: "Calculadora de IMC",
    body: "Índice de masa corporal con categorías en español.",
  },
  {
    href: "/clearance-creatinina",
    title: "Clearance de creatinina",
    body: "Estimación Cockcroft–Gault (mL/min) a partir de creatinina sérica.",
  },
  {
    href: "/ajuste-antibioticos",
    title: "Ajuste renal de antibióticos",
    body: "Orientación resumida según depuración; siempre contrastar con guías y ficha técnica.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Herramientas para guardia
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          MedTools Guardia: calculadoras clínicas en español
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Diseño mobile-first, carga rápida y textos pensados para SEO médico.
          Pronto podrás integrar publicidad (por ejemplo Google AdSense) en
          bloques dedicados sin entorpecer la lectura clínica.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-teal-800">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{tool.body}</p>
            <span className="mt-4 inline-flex text-sm font-medium text-teal-700">
              Abrir herramienta →
            </span>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-800">Próximos pasos sugeridos</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>
            Sustituye la URL en <code className="text-xs bg-white px-1 rounded">layout.tsx</code>{" "}
            (<code className="text-xs bg-white px-1 rounded">metadataBase</code>) por tu dominio
            real para Open Graph y SEO.
          </li>
          <li>
            Añade <code className="text-xs bg-white px-1 rounded">sitemap.xml</code> y{" "}
            <code className="text-xs bg-white px-1 rounded">robots.txt</code> cuando publiques.
          </li>
          <li>
            Reserva un hueco visible para AdSense (por ejemplo bajo el resultado
            de cada calculadora) cumpliendo políticas de contenido médico de Google.
          </li>
        </ul>
      </section>
    </div>
  );
}
