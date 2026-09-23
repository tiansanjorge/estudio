"use client";

import { Component, useState, type ReactNode } from "react";

interface LimiteErrorProps {
  children: ReactNode;
}

interface LimiteErrorState {
  tieneError: boolean;
}

class LimiteError extends Component<LimiteErrorProps, LimiteErrorState> {
  state: LimiteErrorState = { tieneError: false };

  static getDerivedStateFromError() {
    return { tieneError: true };
  }

  reintentar = () => this.setState({ tieneError: false });

  render() {
    if (this.state.tieneError) {
      return (
        <div className="flex flex-col gap-3 rounded-xl border border-error/30 bg-error-soft p-4">
          <span className="text-sm font-medium text-error">
            Este widget falló, pero el resto de la página sigue funcionando.
          </span>
          <button
            type="button"
            onClick={this.reintentar}
            className="w-fit rounded-lg border border-error/30 px-3 py-1.5 text-sm font-medium text-error transition-colors hover:bg-error/10"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function WidgetQueFalla({ debeFallar }: { debeFallar: boolean }) {
  if (debeFallar) {
    throw new Error("Fallo simulado durante el render de este widget");
  }
  return (
    <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success">
      Widget renderizando con normalidad.
    </div>
  );
}

export function ErrorBoundaryDemo() {
  const [debeFallar, setDebeFallar] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setDebeFallar(true);
            setKey((k) => k + 1);
          }}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
        >
          Romper el widget
        </button>
        <button
          type="button"
          onClick={() => {
            setDebeFallar(false);
            setKey((k) => k + 1);
          }}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
        >
          Reiniciar demo completa
        </button>
      </div>

      <LimiteError key={key}>
        <WidgetQueFalla debeFallar={debeFallar} />
      </LimiteError>

      <p className="text-xs text-muted-foreground">
        El componente <code>LimiteError</code> es una clase real con{" "}
        <code>getDerivedStateFromError</code>. El botón &quot;Reintentar&quot;
        dentro del fallback resetea su estado; &quot;Reiniciar demo
        completa&quot; cambia la key para forzar un remount desde cero.
      </p>
    </div>
  );
}
