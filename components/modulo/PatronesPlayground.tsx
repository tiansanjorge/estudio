"use client";

import { useState } from "react";
import {
  ESTRATEGIAS_ENVIO,
  Emisor,
  OBSERVADORES,
  cotizarEnvio,
  crearNotificador,
  type Canal,
  type PedidoConfirmado,
} from "@/lib/modules/arquitectura/design-patterns";

type Patron = "strategy" | "observer" | "factory";

const PATRONES: { id: Patron; nombre: string; idea: string }[] = [
  {
    id: "strategy",
    nombre: "Strategy",
    idea: "Algoritmos intercambiables detrás de una misma interfaz, elegidos en runtime.",
  },
  {
    id: "observer",
    nombre: "Observer",
    idea: "Un emisor avisa a quienes se suscribieron, sin conocerlos.",
  },
  {
    id: "factory",
    nombre: "Factory",
    idea: "Una función decide qué clase concreta crear; el que llama solo pide lo que necesita.",
  },
];

const ESTILO_BOTON = (activo: boolean) =>
  `rounded-xl border px-3 py-1.5 text-xs transition-colors ${
    activo ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:text-foreground"
  }`;

function DemoStrategy() {
  const [estrategiaId, setEstrategiaId] = useState(ESTRATEGIAS_ENVIO[0].id);
  const [pesoKg, setPesoKg] = useState(3);
  const estrategia = ESTRATEGIAS_ENVIO.find((e) => e.id === estrategiaId) ?? ESTRATEGIAS_ENVIO[0];
  const costo = cotizarEnvio({ pesoKg, distanciaKm: 25 }, estrategia);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Estrategia de envío">
        {ESTRATEGIAS_ENVIO.map((e) => (
          <button key={e.id} type="button" aria-pressed={e.id === estrategiaId} onClick={() => setEstrategiaId(e.id)} className={ESTILO_BOTON(e.id === estrategiaId)}>
            {e.nombre}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1 text-xs text-foreground">
        Peso: {pesoKg} kg (distancia fija: 25 km)
        <input type="range" min={1} max={20} value={pesoKg} onChange={(e) => setPesoKg(Number(e.target.value))} className="accent-accent" />
      </label>
      <p className="font-mono text-sm text-foreground" aria-live="polite">
        cotizarEnvio(envío, {estrategia.nombre}) = ${costo.toLocaleString("es-AR")}
      </p>
      <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] text-foreground">
{`function cotizarEnvio(envio: Envio, estrategia: EstrategiaEnvio) {
  return estrategia.calcular(envio); // no hay if por tipo de envío
}
// agregar "Moto en el día" = agregar una estrategia, sin tocar cotizarEnvio`}
      </pre>
    </div>
  );
}

function DemoObserver() {
  const [activos, setActivos] = useState<Set<string>>(new Set(["inventario", "email"]));
  const [registro, setRegistro] = useState<string[]>([]);

  function confirmarPedido() {
    const emisor = new Emisor<PedidoConfirmado>();
    const lineas: string[] = [];
    for (const o of OBSERVADORES) {
      if (activos.has(o.id)) emisor.suscribir((p) => lineas.push(o.reaccion(p)));
    }
    emisor.emitir({ id: `A-${Math.floor(Math.random() * 900 + 100)}`, total: 45000 });
    setRegistro(lineas.length ? lineas : ["(nadie escucha el evento)"]);
  }

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-1 text-xs text-muted-foreground">Suscriptores de &quot;pedidoConfirmado&quot;</legend>
        {OBSERVADORES.map((o) => (
          <label key={o.id} className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
            <input
              type="checkbox"
              checked={activos.has(o.id)}
              onChange={(e) =>
                setActivos((prev) => {
                  const siguiente = new Set(prev);
                  if (e.target.checked) siguiente.add(o.id);
                  else siguiente.delete(o.id);
                  return siguiente;
                })
              }
              className="accent-accent"
            />
            {o.nombre}
          </label>
        ))}
      </fieldset>
      <button type="button" onClick={confirmarPedido} className="self-start rounded-xl border border-accent bg-accent-soft px-4 py-2 text-sm text-accent">
        emisor.emitir(pedidoConfirmado)
      </button>
      <ul className="flex flex-col gap-1 font-mono text-xs text-foreground" aria-live="polite">
        {registro.map((l) => (
          <li key={l}>→ {l}</li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        El checkout no conoce a Inventario, Email ni Analytics: solo emite el evento. Sumar un
        suscriptor nuevo no toca el código del checkout.
      </p>
    </div>
  );
}

function DemoFactory() {
  const [canal, setCanal] = useState<Canal>("email");
  const resultado = crearNotificador(canal).enviar("Tu pedido A-1042 salió del depósito y llega mañana entre 9 y 13 h");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Canal">
        {(["email", "sms", "push"] as Canal[]).map((c) => (
          <button key={c} type="button" aria-pressed={c === canal} onClick={() => setCanal(c)} className={ESTILO_BOTON(c === canal)}>
            {c}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] text-foreground">
{`const notificador = crearNotificador("${canal}"); // el llamador no hace new
notificador.enviar(mensaje);`}
      </pre>
      <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 font-mono text-xs text-foreground" aria-live="polite">
        {resultado}
      </p>
    </div>
  );
}

export function PatronesPlayground() {
  const [patron, setPatron] = useState<Patron>("strategy");
  const actual = PATRONES.find((p) => p.id === patron) ?? PATRONES[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Patrón">
        {PATRONES.map((p) => (
          <button key={p.id} type="button" aria-pressed={p.id === patron} onClick={() => setPatron(p.id)} className={ESTILO_BOTON(p.id === patron)}>
            {p.nombre}
          </button>
        ))}
      </div>
      <p className="text-sm text-foreground">{actual.idea}</p>
      <div className="rounded-2xl border border-border bg-surface p-4">
        {patron === "strategy" && <DemoStrategy />}
        {patron === "observer" && <DemoObserver />}
        {patron === "factory" && <DemoFactory />}
      </div>
    </div>
  );
}
