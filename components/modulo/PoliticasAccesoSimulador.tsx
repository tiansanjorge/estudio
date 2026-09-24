"use client";

import { useState } from "react";
import {
  ACCIONES,
  decidirAbac,
  decidirRbac,
  type Decision,
  type Departamento,
  type Documento,
  type Rol,
  type Sujeto,
} from "@/lib/modules/seguridad/rbac-abac";
import { BloqueCodigo } from "./BloqueCodigo";

const CODIGO_RBAC = `
// El permiso depende SOLO del rol
const PERMISOS = {
  lector: ["ver"],
  editor: ["ver", "editar", "publicar"],
  admin: ["ver", "editar", "publicar", "borrar"],
};

const puede = (usuario, accion) =>
  PERMISOS[usuario.rol].includes(accion);`;

const CODIGO_ABAC = `
// Mira atributos del usuario Y del documento
function puedeEditar(usuario, doc) {
  if (usuario.rol === "admin") return true;
  const mismoDepto = usuario.depto === doc.depto;
  if (doc.confidencial && !mismoDepto) return false;
  if (doc.estado === "publicado") return false;
  return doc.autor === usuario.id ||
    (usuario.rol === "editor" && mismoDepto);
}`;

function Selector<T extends string>({
  etiqueta,
  valor,
  opciones,
  alCambiar,
}: {
  etiqueta: string;
  valor: T;
  opciones: { valor: T; texto: string }[];
  alCambiar: (v: T) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      {etiqueta}
      <select
        value={valor}
        onChange={(e) => alCambiar(e.target.value as T)}
        className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-foreground"
      >
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </label>
  );
}

const DEPARTAMENTOS: { valor: Departamento; texto: string }[] = [
  { valor: "ventas", texto: "Ventas" },
  { valor: "legales", texto: "Legales" },
];

function Celda({ decision }: { decision: Decision }) {
  return (
    <div
      className={`flex flex-col gap-0.5 rounded-lg border px-2 py-1.5 text-[11px] ${
        decision.permitido ? "border-success/30 bg-success-soft" : "border-error/30 bg-error-soft"
      }`}
    >
      <span className={`font-mono ${decision.permitido ? "text-success" : "text-error"}`}>
        {decision.permitido ? "permitido" : "denegado"}
      </span>
      <span className="text-foreground">{decision.regla}</span>
    </div>
  );
}

export function PoliticasAccesoSimulador() {
  const [sujeto, setSujeto] = useState<Sujeto>({ id: "beto", rol: "editor", departamento: "ventas" });
  const [doc, setDoc] = useState<Documento>({
    duenoId: "ana",
    departamento: "ventas",
    estado: "borrador",
    confidencial: false,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <fieldset className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
          <legend className="px-1 text-sm font-medium text-foreground">Usuario</legend>
          <Selector
            etiqueta="Quién es"
            valor={sujeto.id}
            opciones={[
              { valor: "ana", texto: "Ana (autora del documento)" },
              { valor: "beto", texto: "Beto" },
            ]}
            alCambiar={(id) => setSujeto((s) => ({ ...s, id }))}
          />
          <Selector<Rol>
            etiqueta="Rol"
            valor={sujeto.rol}
            opciones={[
              { valor: "lector", texto: "lector" },
              { valor: "editor", texto: "editor" },
              { valor: "admin", texto: "admin" },
            ]}
            alCambiar={(rol) => setSujeto((s) => ({ ...s, rol }))}
          />
          <Selector<Departamento>
            etiqueta="Departamento"
            valor={sujeto.departamento}
            opciones={DEPARTAMENTOS}
            alCambiar={(departamento) => setSujeto((s) => ({ ...s, departamento }))}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
          <legend className="px-1 text-sm font-medium text-foreground">Documento (de Ana)</legend>
          <Selector<Departamento>
            etiqueta="Departamento"
            valor={doc.departamento}
            opciones={DEPARTAMENTOS}
            alCambiar={(departamento) => setDoc((d) => ({ ...d, departamento }))}
          />
          <Selector<Documento["estado"]>
            etiqueta="Estado"
            valor={doc.estado}
            opciones={[
              { valor: "borrador", texto: "borrador" },
              { valor: "publicado", texto: "publicado" },
            ]}
            alCambiar={(estado) => setDoc((d) => ({ ...d, estado }))}
          />
          <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
            <input
              type="checkbox"
              checked={doc.confidencial}
              onChange={(e) => setDoc((d) => ({ ...d, confidencial: e.target.checked }))}
              className="accent-accent"
            />
            Confidencial
          </label>
        </fieldset>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-xs">
          <thead>
            <tr className="text-muted-foreground">
              <th className="py-2 pr-3 font-normal">Acción</th>
              <th className="py-2 pr-3 font-normal">RBAC (solo el rol)</th>
              <th className="py-2 font-normal">ABAC (atributos)</th>
            </tr>
          </thead>
          <tbody>
            {ACCIONES.map((accion) => (
              <tr key={accion} className="align-top">
                <td className="py-1.5 pr-3 font-mono text-foreground">{accion}</td>
                <td className="py-1.5 pr-3">
                  <Celda decision={decidirRbac(sujeto, accion)} />
                </td>
                <td className="py-1.5">
                  <Celda decision={decidirAbac(sujeto, doc, accion)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BloqueCodigo titulo="RBAC" codigo={CODIGO_RBAC} resaltadas={[9]} />
        <BloqueCodigo titulo="ABAC (acción: editar)" codigo={CODIGO_ABAC} resaltadas={[5, 6, 7, 8]} />
      </div>

      <p className="text-xs text-muted-foreground">
        Probá: Beto editor de Legales. Para RBAC puede editar cualquier documento; ABAC mira el
        departamento, el estado y quién es el autor.
      </p>
    </div>
  );
}
