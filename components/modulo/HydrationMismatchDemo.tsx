"use client";

import { useEffect, useState } from "react";

function RelojConMismatch() {
  const hora = new Date().toLocaleTimeString("es-AR");
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-error/30 bg-error-soft p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-error">
        Con mismatch
      </span>
      <span className="font-mono text-lg text-error">{hora}</span>
    </div>
  );
}

function RelojArreglado() {
  const [hora, setHora] = useState<string | null>(null);

  useEffect(() => {
    // Patrón recomendado para evitar hydration mismatch: el valor real
    // solo se calcula del lado del cliente, después de hidratar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHora(new Date().toLocaleTimeString("es-AR"));
  }, []);

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-success/30 bg-success-soft p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-success">
        Arreglado
      </span>
      <span className="font-mono text-lg text-success">{hora ?? "Cargando…"}</span>
    </div>
  );
}

export function HydrationMismatchDemo() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Abrí la consola del navegador (F12) y recargá esta página con F5.
        El reloj de la izquierda calcula la hora directo en el cuerpo del
        componente — el servidor calcula una hora, el cliente calcula
        otra al hidratar, y vas a ver la advertencia real de React en la
        consola. El de la derecha usa el patrón seguro: arranca con{" "}
        <code>null</code> (mismo valor en servidor y cliente) y recién
        calcula la hora real en un useEffect, después de hidratar.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RelojConMismatch />
        <RelojArreglado />
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        Esto es exactamente el mismo tipo de problema que resolvimos en
        este proyecto con el toggle de tema: el script anti-flash del{" "}
        <code>&lt;head&gt;</code> le pone una clase al <code>&lt;html&gt;</code>{" "}
        antes de que React hidrate, así que usamos{" "}
        <code>suppressHydrationWarning</code> para decirle a React
        &ldquo;este mismatch puntual es intencional&rdquo;.
      </p>
    </div>
  );
}
