export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 text-xs text-slate-500 space-y-3">
        <p className="font-medium text-slate-600">
          Aviso médico: el contenido es solo educativo y no sustituye el juicio
          clínico ni las guías locales. Verifica siempre con fuentes oficiales y
          con tu equipo asistencial.
        </p>
        <p>© {new Date().getFullYear()} MedTools Guardia.</p>
      </div>
    </footer>
  );
}
