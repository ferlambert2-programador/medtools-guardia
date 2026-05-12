import Link from "next/link";

const nav = [
  { href: "/imc", label: "IMC" },
  { href: "/clearance-creatinina", label: "Clearance" },
  { href: "/ajuste-antibioticos", label: "Antibióticos" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-teal-700 tracking-tight"
        >
          MedTools Guardia
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
