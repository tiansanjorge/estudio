export type FaseCommit = "render" | "commit" | "paint" | "effect";

export interface PasoCommit {
  descripcion: string;
  faseActiva: FaseCommit;
  consola: string[];
}

export const pasosCommit: PasoCommit[] = [
  {
    descripcion: "React ejecuta el cuerpo del componente (fase de Render).",
    faseActiva: "render",
    consola: ["render"],
  },
  {
    descripcion:
      "Reconciliation ya decidió qué cambió. React entra en Commit: aplica esos cambios al DOM real de forma sincrónica — inserta, actualiza y elimina nodos, y conecta los refs.",
    faseActiva: "commit",
    consola: ["render"],
  },
  {
    descripcion:
      "Inmediatamente después de mutar el DOM, y todavía ANTES de que el navegador pinte nada en pantalla, corren los useLayoutEffect.",
    faseActiva: "commit",
    consola: ["render", "layout effect"],
  },
  {
    descripcion:
      "Recién ahora el navegador pinta la pantalla: es el primer momento en que el usuario ve el resultado.",
    faseActiva: "paint",
    consola: ["render", "layout effect"],
  },
  {
    descripcion: "Después del paint, de forma asincrónica, corren los useEffect.",
    faseActiva: "effect",
    consola: ["render", "layout effect", "effect"],
  },
];
