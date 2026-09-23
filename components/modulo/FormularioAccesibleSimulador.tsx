"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import {
  CAMPOS,
  anuncioDelCampo,
  validar,
  type CampoId,
  type ConfigFormulario,
  type Errores,
} from "@/lib/modules/accesibilidad/formularios-accesibles";

const OPCIONES: { clave: keyof ConfigFormulario; etiqueta: string }[] = [
  { clave: "labelAsociado", etiqueta: "<label> asociado (no solo placeholder)" },
  { clave: "errorAsociado", etiqueta: "Error con aria-describedby + aria-invalid" },
  { clave: "enfocarPrimerError", etiqueta: "Enfocar el primer error al enviar" },
];

const VALORES_INICIALES: Record<CampoId, string> = { nombre: "", email: "" };

export function FormularioAccesibleSimulador() {
  const [config, setConfig] = useState<ConfigFormulario>({
    labelAsociado: false,
    errorAsociado: false,
    enfocarPrimerError: false,
  });
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);
  const [campoEnfocado, setCampoEnfocado] = useState<CampoId | null>(null);
  const baseId = useId();
  const refs = useRef<Partial<Record<CampoId, HTMLInputElement | null>>>({});

  function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos = validar(valores);
    setErrores(nuevos);
    setEnviado(Object.keys(nuevos).length === 0);
    const primerInvalido = CAMPOS.find((c) => nuevos[c.id]);
    if (primerInvalido && config.enfocarPrimerError) refs.current[primerInvalido.id]?.focus();
  }

  const campoAnunciado = CAMPOS.find((c) => c.id === campoEnfocado);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2 text-sm">
        <legend className="mb-2 font-medium text-foreground">Implementación</legend>
        {OPCIONES.map(({ clave, etiqueta }) => (
          <label key={clave} className="flex cursor-pointer items-center gap-2 font-mono text-xs text-foreground">
            <input
              type="checkbox"
              checked={config[clave]}
              onChange={(e) => setConfig((c) => ({ ...c, [clave]: e.target.checked }))}
              className="accent-accent"
            />
            {etiqueta}
          </label>
        ))}
      </fieldset>

      <div className="grid gap-6 md:grid-cols-2">
        <form
          noValidate
          onSubmit={enviar}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4"
        >
          {CAMPOS.map((campo) => {
            const error = errores[campo.id];
            const idInput = `${baseId}-${campo.id}`;
            const idError = `${idInput}-error`;
            return (
              <div key={campo.id} className="flex flex-col gap-1">
                {config.labelAsociado && (
                  <label htmlFor={idInput} className="text-sm text-foreground">
                    {campo.etiqueta} <span aria-hidden="true">*</span>
                  </label>
                )}
                <input
                  ref={(el) => {
                    refs.current[campo.id] = el;
                  }}
                  id={idInput}
                  type={campo.tipo}
                  autoComplete={campo.autoComplete}
                  placeholder={campo.placeholder}
                  required
                  value={valores[campo.id]}
                  onChange={(e) => setValores((v) => ({ ...v, [campo.id]: e.target.value }))}
                  onFocus={() => setCampoEnfocado(campo.id)}
                  aria-invalid={config.errorAsociado && error ? true : undefined}
                  aria-describedby={config.errorAsociado && error ? idError : undefined}
                  className={`rounded-lg border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    error ? "border-error" : "border-border"
                  }`}
                />
                {error && (
                  <p id={idError} className="text-xs text-error">
                    {error}
                  </p>
                )}
              </div>
            );
          })}
          <button
            type="submit"
            className="self-start rounded-xl border border-accent bg-accent-soft px-4 py-2 text-sm text-accent"
          >
            Registrarme
          </button>
          {enviado && (
            <p className="text-xs text-success">Formulario válido: se enviaría.</p>
          )}
        </form>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">Lo que anuncia el lector de pantalla</p>
          {campoAnunciado ? (
            <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 font-mono text-xs text-foreground">
              {anuncioDelCampo(campoAnunciado, config, errores[campoAnunciado.id])}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Enfocá un campo, o enviá el formulario vacío.
            </p>
          )}
          <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
            {!config.labelAsociado && (
              <li>
                Sin label, el nombre accesible sale del placeholder: se anuncia un
                ejemplo (&quot;Ana García&quot;) en vez de qué dato se pide, y al
                escribir desaparece de la vista.
              </li>
            )}
            {!config.errorAsociado && (
              <li>
                El error se ve en rojo, pero no está vinculado al campo: el lector
                no lo menciona al enfocarlo.
              </li>
            )}
            {!config.enfocarPrimerError && (
              <li>
                Al enviar con errores el foco se queda en el botón: quien no ve
                la pantalla no se entera de que algo falló.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
