"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/clearance-creatinina", label: "Renal" },
  { href: "/ajuste-antibioticos", label: "Antibióticos" },
  { href: "/scores-uci", label: "UCI" },
  { href: "/infectologia", label: "Infectología" },
  { href: "/cardiovascular", label: "Cardio" },
  { href: "/nutricion", label: "Nutrición" },
  { href: "/respiratorio", label: "Respiratorio" },
  { href: "/nefrologia", label: "Nefrología" },
  { href: "/imc", label: "IMC" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-teal-700 tracking-tight shrink-0"
        >
          MedTools Guardia
        </Link>
        <nav
          className="flex gap-2 text-sm overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: "none" }}
        >
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 transition-colors whitespace-nowrap ${
                  active
                    ? "bg-teal-100 text-teal-800 font-semibold"
                    : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
