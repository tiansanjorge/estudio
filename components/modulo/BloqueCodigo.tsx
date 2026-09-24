interface BloqueCodigoProps {
  codigo: string;
  /** Números de línea (empezando en 1) a resaltar: lo que se está ejecutando o lo que cambia. */
  resaltadas?: number[];
  /** Nombre de archivo o del modo que se muestra (ej. "Secuencial"). */
  titulo?: string;
}

/**
 * Snippet que acompaña a un playground: muestra el código que explica lo que
 * se está probando, opcionalmente con líneas resaltadas.
 */
export function BloqueCodigo({ codigo, resaltadas = [], titulo }: BloqueCodigoProps) {
  const lineas = codigo.replace(/^\n+|\n+$/g, "").split("\n");

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-background">
      {titulo && (
        <figcaption className="border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
          {titulo}
        </figcaption>
      )}
      <pre className="overflow-x-auto py-3 font-mono text-xs leading-5 text-foreground">
        {lineas.map((linea, index) => {
          const activa = resaltadas.includes(index + 1);
          return (
            <div
              key={index}
              className={`min-w-fit border-l-2 px-4 transition-colors ${
                activa ? "border-accent bg-accent-soft text-accent" : "border-transparent"
              }`}
            >
              {linea || " "}
            </div>
          );
        })}
      </pre>
    </figure>
  );
}
