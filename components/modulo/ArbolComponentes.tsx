import type { NodoComponente } from "@/lib/modules/react-core/arbol";

interface ArbolComponentesProps {
  nodo: NodoComponente;
}

function claseNodo(rol: NodoComponente["rol"]): string {
  if (rol === "intermedio") return "border-border bg-surface";
  if (rol === "usaContext") return "border-info/30 bg-info-soft";
  return "border-accent/30 bg-accent-soft";
}

function claseNombre(rol: NodoComponente["rol"]): string {
  if (rol === "intermedio") return "text-muted-foreground";
  if (rol === "usaContext") return "text-info";
  return "text-accent";
}

export function ArbolComponentes({ nodo }: ArbolComponentesProps) {
  return (
    <div className={`flex flex-col gap-2 rounded-xl border p-3 ${claseNodo(nodo.rol)}`}>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className={`font-mono text-sm font-semibold ${claseNombre(nodo.rol)}`}>
          &lt;{nodo.nombre} /&gt;
        </span>
        {nodo.rol === "intermedio" && (
          <span className="text-xs text-muted-foreground">(solo reenvía props)</span>
        )}
        {nodo.rol === "usaContext" && (
          <span className="text-xs text-info">(lee del Context)</span>
        )}
        {nodo.props &&
          Object.entries(nodo.props).map(([clave, valor]) => (
            <span key={clave} className="font-mono text-xs text-muted-foreground">
              {clave}={valor}
            </span>
          ))}
      </div>
      {nodo.hijos && nodo.hijos.length > 0 && (
        <div className="flex flex-col gap-2 border-l-2 border-accent/20 pl-4">
          {nodo.hijos.map((hijo, index) => (
            <ArbolComponentes key={index} nodo={hijo} />
          ))}
        </div>
      )}
    </div>
  );
}
