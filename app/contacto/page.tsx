export default function ContactoPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Contacto</h1>
        <p className="mt-2 text-slate-500 text-sm">Consultas, sugerencias o reportes de errores</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-teal-700">Escribinos</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Si tenés sugerencias de nuevas calculadoras, encontraste algún error en los cálculos,
          o querés hacernos alguna consulta sobre la aplicación, podés escribirnos a:
        </p>
        <a
          href="mailto:ferlambert2@gmail.com"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          ✉️ ferlambert2@gmail.com
        </a>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold text-teal-700">Reportar un error</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Si detectás un cálculo incorrecto o un comportamiento inesperado, por favor indicá:
        </p>
        <ul className="list-disc list-inside text-slate-700 text-sm space-y-1 pl-1">
          <li>El módulo o calculadora afectada</li>
          <li>Los valores ingresados y el resultado obtenido</li>
          <li>El resultado esperado o la fuente de referencia</li>
        </ul>
        <p className="text-slate-500 text-xs mt-2">
          Tu colaboración ayuda a mejorar la precisión de la herramienta para todos.
        </p>
      </div>
    </div>
  );
}
