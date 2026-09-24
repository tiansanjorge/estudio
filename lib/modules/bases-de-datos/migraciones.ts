export type EstrategiaMigracion = "directo" | "expand-contract";

export interface InstanciaApp {
  version: string;
  ok: boolean;
  nota: string;
}

export interface PasoMigracion {
  titulo: string;
  // lo que se ejecuta en este paso: SQL o un deploy de la app
  accion: string;
  columnas: string[];
  // durante un rolling deploy conviven la versión vieja y la nueva
  instancias: InstanciaApp[];
}

export const ESTRATEGIAS_MIGRACION: { id: EstrategiaMigracion; nombre: string }[] = [
  { id: "directo", nombre: "Rename directo" },
  { id: "expand-contract", nombre: "Expand / contract" },
];

const V1_OK: InstanciaApp = { version: "v1", ok: true, nota: "lee y escribe nombre" };

export const PASOS: Record<EstrategiaMigracion, PasoMigracion[]> = {
  directo: [
    {
      titulo: "Estado inicial",
      accion: "—",
      columnas: ["id", "nombre"],
      instancias: [V1_OK],
    },
    {
      titulo: "Migración",
      accion: "ALTER TABLE usuarios RENAME COLUMN nombre TO nombre_completo;",
      columnas: ["id", "nombre_completo"],
      instancias: [{ version: "v1", ok: false, nota: 'ERROR: column "nombre" does not exist' }],
    },
    {
      titulo: "Rolling deploy de v2",
      accion: "deploy v2 (usa nombre_completo)",
      columnas: ["id", "nombre_completo"],
      instancias: [
        { version: "v1", ok: false, nota: "las instancias que todavía no se reemplazaron siguen fallando" },
        { version: "v2", ok: true, nota: "lee y escribe nombre_completo" },
      ],
    },
    {
      titulo: "Deploy terminado",
      accion: "—",
      columnas: ["id", "nombre_completo"],
      instancias: [{ version: "v2", ok: true, nota: "funciona, pero hubo errores durante todo el deploy" }],
    },
  ],
  "expand-contract": [
    {
      titulo: "Estado inicial",
      accion: "—",
      columnas: ["id", "nombre"],
      instancias: [V1_OK],
    },
    {
      titulo: "Expand: agregar la columna nueva",
      accion: "ALTER TABLE usuarios ADD COLUMN nombre_completo text;",
      columnas: ["id", "nombre", "nombre_completo"],
      instancias: [{ version: "v1", ok: true, nota: "ignora la columna nueva (nullable, sin default)" }],
    },
    {
      titulo: "Deploy v2: escribir en las dos",
      accion: "deploy v2 (escribe nombre y nombre_completo, lee nombre)",
      columnas: ["id", "nombre", "nombre_completo"],
      instancias: [
        V1_OK,
        { version: "v2", ok: true, nota: "doble escritura; sigue leyendo nombre" },
      ],
    },
    {
      titulo: "Backfill por lotes",
      accion: "UPDATE usuarios SET nombre_completo = nombre WHERE id BETWEEN $1 AND $2 AND nombre_completo IS NULL;",
      columnas: ["id", "nombre", "nombre_completo"],
      instancias: [{ version: "v2", ok: true, nota: "las filas viejas ya tienen nombre_completo" }],
    },
    {
      titulo: "Deploy v3: leer de la nueva",
      accion: "deploy v3 (lee y escribe solo nombre_completo)",
      columnas: ["id", "nombre", "nombre_completo"],
      instancias: [
        { version: "v2", ok: true, nota: "sigue escribiendo las dos columnas" },
        { version: "v3", ok: true, nota: "ya no toca nombre" },
      ],
    },
    {
      titulo: "Contract: borrar la columna vieja",
      accion: "ALTER TABLE usuarios DROP COLUMN nombre;",
      columnas: ["id", "nombre_completo"],
      instancias: [{ version: "v3", ok: true, nota: "nadie usa nombre: se puede borrar sin romper nada" }],
    },
  ],
};
