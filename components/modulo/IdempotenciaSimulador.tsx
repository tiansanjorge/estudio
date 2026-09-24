"use client";

import { useState } from "react";
import {
  ESCENARIOS,
  IMPLEMENTACIONES,
  simular,
  type Escenario,
  type Implementacion,
} from "@/lib/modules/system-design/idempotencia-rate-limiting";
import { BloqueCodigo } from "./BloqueCodigo";

const CODIGO: Record<Implementacion, { codigo: string; clave: number[] }> = {
  ninguna: {
    codigo: `
app.post("/cobros", async (req, res) => {
  // cada request que llega cobra otra vez
  const cobro = await pasarela.cobrar(req.body);
  res.json(cobro);
});`,
    clave: [3],
  },
  memoria: {
    codigo: `
const respuestas = new Map(); // vive solo en ESTA instancia

app.post("/cobros", async (req, res) => {
  const clave = req.header("Idempotency-Key");
  if (respuestas.has(clave)) return res.json(respuestas.get(clave));
  const cobro = await pasarela.cobrar(req.body); // el otro request ya pasó el if
  respuestas.set(clave, cobro);
  res.json(cobro);
});`,
    clave: [1, 5, 6],
  },
  tabla: {
    codigo: `
app.post("/cobros", async (req, res) => {
  const clave = req.header("Idempotency-Key");
  const huella = sha256(JSON.stringify(req.body));
  // UNIQUE(clave): de dos requests simultáneos, solo uno inserta
  const { rowCount } = await db.query(
    \`INSERT INTO idempotencia (clave, huella, estado)
     VALUES ($1, $2, 'en_curso') ON CONFLICT (clave) DO NOTHING\`,
    [clave, huella],
  );
  if (rowCount === 0) {
    const previa = await db.buscarIdempotencia(clave);
    if (previa.huella !== huella) return res.status(422).end(); // misma clave, otro body
    if (previa.estado === "en_curso") return res.status(409).end();
    return res.json(previa.respuesta); // devuelve lo mismo, sin cobrar
  }
  const cobro = await pasarela.cobrar(req.body);
  await db.completarIdempotencia(clave, cobro);
  res.json(cobro);
});`,
    clave: [5, 6, 12, 14],
  },
};

function Opciones<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambio,
}: {
  etiqueta: string;
  opciones: { id: T; nombre: string }[];
  valor: T;
  onCambio: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{etiqueta}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={etiqueta}>
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === valor}
            onClick={() => onCambio(o.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              o.id === valor ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IdempotenciaSimulador() {
  const [escenario, setEscenario] = useState<Escenario>("reintento");
  const [implementacion, setImplementacion] = useState<Implementacion>("memoria");
  const resultado = simular(escenario, implementacion);
  const descripcion = ESCENARIOS.find((e) => e.id === escenario)?.descripcion;

  return (
    <div className="flex flex-col gap-6">
      <Opciones etiqueta="Qué pasa" opciones={ESCENARIOS} valor={escenario} onCambio={setEscenario} />
      <p className="text-sm text-muted-foreground">{descripcion}</p>
      <Opciones etiqueta="Cómo está implementado" opciones={IMPLEMENTACIONES} valor={implementacion} onCambio={setImplementacion} />

      <BloqueCodigo
        codigo={CODIGO[implementacion].codigo}
        resaltadas={CODIGO[implementacion].clave}
      />

      <div
        className={`flex flex-col gap-3 rounded-2xl border p-4 ${
          resultado.correcto ? "border-success/30 bg-success-soft" : "border-error/30 bg-error-soft"
        }`}
        aria-live="polite"
      >
        <span className={`text-sm font-medium ${resultado.correcto ? "text-success" : "text-error"}`}>
          {resultado.cobros} cobro{resultado.cobros === 1 ? "" : "s"} · {resultado.correcto ? "resultado correcto" : "resultado incorrecto"}
        </span>
        <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm text-foreground">
          {resultado.pasos.map((paso) => (
            <li key={paso}>{paso}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
