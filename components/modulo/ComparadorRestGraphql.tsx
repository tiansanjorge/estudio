"use client";

import { useState } from "react";
import type { EscenarioComparacion } from "@/lib/modules/http/rest-vs-graphql";

interface ComparadorRestGraphqlProps {
  escenarios: EscenarioComparacion[];
}

export function ComparadorRestGraphql({ escenarios }: ComparadorRestGraphqlProps) {
  const [index, setIndex] = useState(0);
  const escenario = escenarios[index];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {escenarios.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setIndex(i)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              i === index
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.titulo}
          </button>
        ))}
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{escenario.descripcion}</p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            REST
          </span>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-foreground">
            {escenario.rest.requests.join("\n")}
          </pre>
          <p className="text-sm leading-6 text-muted-foreground">{escenario.rest.comentario}</p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            GraphQL
          </span>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-foreground">
            {escenario.graphql.query}
          </pre>
          <p className="text-sm leading-6 text-muted-foreground">{escenario.graphql.comentario}</p>
        </div>
      </div>
    </div>
  );
}
