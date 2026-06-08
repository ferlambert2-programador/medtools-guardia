export default function AcercaDePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Acerca de MedTools Guardia</h1>
        <p className="mt-2 text-slate-500 text-sm">Información sobre la aplicación</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-teal-700">¿Qué es MedTools Guardia?</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          MedTools Guardia es una colección de calculadoras clínicas en español, diseñadas
          específicamente para médicos que trabajan en guardia y terapia intensiva. Reúne en un
          solo lugar las herramientas más utilizadas en la práctica diaria: scores pronósticos,
          ajuste de antibióticos, análisis gasométrico, calculadoras renales y más.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-teal-700">Origen</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          La aplicación fue creada por un médico intensivista argentino, con el objetivo de
          disponer de una herramienta práctica, rápida y en español durante las guardias y el
          trabajo en unidades de cuidados intensivos. Surge de la necesidad cotidiana de acceder
          a cálculos confiables sin depender de recursos en otros idiomas o de aplicaciones
          genéricas no adaptadas al contexto clínico local.
        </p>
      </div>

      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-teal-800">⚠️ Uso educativo — Aviso importante</h2>
        <p className="text-teal-900 text-sm leading-relaxed">
          MedTools Guardia es una herramienta de <strong>uso exclusivamente educativo</strong>.
          Los resultados son orientativos y no reemplazan el criterio clínico del médico
          tratante. Toda decisión terapéutica debe estar basada en la evaluación integral del
          paciente, las guías clínicas vigentes y la ficha técnica de cada medicamento.
        </p>
        <p className="text-teal-900 text-sm leading-relaxed">
          El autor no se responsabiliza por decisiones médicas tomadas en base exclusiva a los
          resultados de esta aplicación.
        </p>
      </div>
    </div>
  );
}
