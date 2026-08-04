import Link from "next/link";
import { categorias, rutaModulo } from "@/lib/modules/registry";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-16 sm:px-8">
      <header className="flex flex-col gap-4">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Frontend Study Lab
        </h1>
        <p className="max-w-xl text-lg leading-7 text-muted-foreground">
          Laboratorios interactivos para entender cómo funciona realmente el
          frontend, no solo memorizar definiciones.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categorias.map((categoria) => (
          <div
            key={categoria.slug}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {categoria.titulo}
            </h2>
            {categoria.modulos.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                Próximamente
              </span>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {categoria.modulos.map((modulo) => {
                  const clases =
                    "rounded-xl border px-3 py-1 text-sm transition-colors " +
                    (modulo.estado === "disponible"
                      ? "border-accent/30 bg-accent-soft text-accent hover:border-accent/60"
                      : "border-border text-muted-foreground");

                  if (modulo.estado === "disponible") {
                    return (
                      <li key={modulo.slug}>
                        <Link
                          href={rutaModulo(categoria.slug, modulo.slug)}
                          className={clases}
                        >
                          {modulo.titulo}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={modulo.slug}>
                      <span className={clases}>{modulo.titulo}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
