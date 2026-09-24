"use client";

import { useRef, useState } from "react";
import { BloqueCodigo } from "./BloqueCodigo";

interface Tarea {
  id: number;
  texto: string;
}

const tareasIniciales: Tarea[] = [
  { id: 1, texto: "Lavar los platos" },
  { id: 2, texto: "Pagar la luz" },
  { id: 3, texto: "Llamar al dentista" },
];

function FilaTarea({ texto }: { texto: string }) {
  const [marcada, setMarcada] = useState(false);

  return (
    <label className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm">
      <input
        type="checkbox"
        checked={marcada}
        onChange={() => setMarcada((v) => !v)}
        className="h-4 w-4 accent-current text-accent"
      />
      <span className={marcada ? "text-muted-foreground line-through" : "text-foreground"}>
        {texto}
      </span>
    </label>
  );
}

function generarCodigo(usarIndice: boolean): string {
  return `
{tareas.map((tarea, index) => (
  <FilaTarea key={${usarIndice ? "index" : "tarea.id"}} texto={tarea.texto} />
))}

function FilaTarea({ texto }) {
  // estado LOCAL: React lo asocia a la key, no al texto
  const [marcada, setMarcada] = useState(false);
  // ...
}`;
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent";

export function ListaConKeys() {
  const [tareas, setTareas] = useState<Tarea[]>(tareasIniciales);
  const [usarIndice, setUsarIndice] = useState(true);
  const idRef = useRef(4);

  function agregarAlPrincipio() {
    idRef.current += 1;
    setTareas((prev) => [{ id: idRef.current, texto: `Nueva tarea ${idRef.current}` }, ...prev]);
  }

  function eliminarPrimera() {
    setTareas((prev) => prev.slice(1));
  }

  function reiniciar() {
    setTareas(tareasIniciales);
    idRef.current = 4;
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Marcá una o dos tareas como hechas. Después agregá una tarea al
        principio (o eliminá la primera) y mirá qué le pasa a los
        checkboxes marcados, según qué tipo de key esté usando la lista.
      </p>

      <button
        type="button"
        onClick={() => setUsarIndice((v) => !v)}
        className={`w-fit rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
          usarIndice
            ? "border-warning/30 bg-warning-soft text-warning"
            : "border-success/30 bg-success-soft text-success"
        }`}
      >
        key = {usarIndice ? "índice del array" : "id estable de la tarea"}
      </button>

      <BloqueCodigo codigo={generarCodigo(usarIndice)} resaltadas={[2, 7]} />

      <div className="flex flex-col gap-2">
        {tareas.map((tarea, index) => (
          <FilaTarea key={usarIndice ? index : tarea.id} texto={tarea.texto} />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={agregarAlPrincipio} className={botonBase}>
          Agregar tarea al principio
        </button>
        <button type="button" onClick={eliminarPrimera} className={botonBase}>
          Eliminar primera
        </button>
        <button type="button" onClick={reiniciar} className={botonBase}>
          Reiniciar
        </button>
      </div>
    </div>
  );
}
