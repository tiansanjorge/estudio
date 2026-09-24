// semántica de Postgres: READ UNCOMMITTED se comporta como READ COMMITTED, así que no hay dirty reads
export type NivelAislamiento = "read-committed" | "repeatable-read" | "serializable";

export const NIVELES_AISLAMIENTO: { id: NivelAislamiento; nombre: string }[] = [
  { id: "read-committed", nombre: "READ COMMITTED" },
  { id: "repeatable-read", nombre: "REPEATABLE READ" },
  { id: "serializable", nombre: "SERIALIZABLE" },
];

export interface PasoTransaccion {
  tx: "T1" | "T2";
  sql: string;
  // qué devuelve o qué pasa en cada nivel; si no depende del nivel, alcanza con uno solo
  resultado: string | Record<NivelAislamiento, string>;
}

export interface Desenlace {
  correcto: boolean;
  texto: string;
}

export interface EscenarioConcurrencia {
  id: string;
  titulo: string;
  contexto: string;
  pasos: PasoTransaccion[];
  desenlace: Record<NivelAislamiento, Desenlace>;
}

export const ESCENARIOS: EscenarioConcurrencia[] = [
  {
    id: "no-repetible",
    titulo: "Lectura no repetible",
    contexto: "T1 genera un reporte y lee el saldo dos veces. T2 registra un pago en el medio.",
    pasos: [
      { tx: "T1", sql: "SELECT saldo FROM cuentas WHERE id = 1", resultado: "100" },
      { tx: "T2", sql: "UPDATE cuentas SET saldo = 50 WHERE id = 1; COMMIT", resultado: "OK" },
      {
        tx: "T1",
        sql: "SELECT saldo FROM cuentas WHERE id = 1",
        resultado: {
          "read-committed": "50",
          "repeatable-read": "100",
          serializable: "100",
        },
      },
    ],
    desenlace: {
      "read-committed": {
        correcto: false,
        texto: "Cada sentencia ve lo último commiteado: la misma consulta devolvió dos valores dentro de una transacción, y el reporte queda inconsistente.",
      },
      "repeatable-read": {
        correcto: true,
        texto: "La transacción usa una sola snapshot, tomada en su primera consulta: ve siempre 100, aunque T2 ya commiteó.",
      },
      serializable: {
        correcto: true,
        texto: "Igual que REPEATABLE READ para este caso: snapshot única.",
      },
    },
  },
  {
    id: "lost-update",
    titulo: "Lost update",
    contexto: "Dos compras del último producto en stock. Cada una lee el stock, resta 1 en la aplicación y escribe el valor calculado.",
    pasos: [
      { tx: "T1", sql: "SELECT stock FROM productos WHERE id = 7", resultado: "1" },
      { tx: "T2", sql: "SELECT stock FROM productos WHERE id = 7", resultado: "1" },
      { tx: "T1", sql: "UPDATE productos SET stock = 0 WHERE id = 7; COMMIT", resultado: "OK" },
      {
        tx: "T2",
        sql: "UPDATE productos SET stock = 0 WHERE id = 7",
        resultado: {
          "read-committed": "OK",
          "repeatable-read": "ERROR: could not serialize access due to concurrent update",
          serializable: "ERROR: could not serialize access due to concurrent update",
        },
      },
    ],
    desenlace: {
      "read-committed": {
        correcto: false,
        texto: "Las dos compras se confirman con un solo producto: la escritura de T2 pisa la de T1. Se evita con UPDATE ... SET stock = stock - 1 WHERE stock > 0, o con SELECT ... FOR UPDATE.",
      },
      "repeatable-read": {
        correcto: true,
        texto: "Postgres detecta que la fila cambió después de la snapshot de T2 y aborta su UPDATE. La aplicación tiene que reintentar la transacción entera.",
      },
      serializable: {
        correcto: true,
        texto: "Mismo error que en REPEATABLE READ: T2 falla y hay que reintentarla.",
      },
    },
  },
  {
    id: "write-skew",
    titulo: "Write skew",
    contexto: "Regla de negocio: siempre tiene que haber al menos un médico de guardia. Hay dos, y los dos piden salir al mismo tiempo.",
    pasos: [
      { tx: "T1", sql: "SELECT count(*) FROM guardias WHERE activo", resultado: "2 → puedo salir" },
      { tx: "T2", sql: "SELECT count(*) FROM guardias WHERE activo", resultado: "2 → puedo salir" },
      { tx: "T1", sql: "UPDATE guardias SET activo = false WHERE medico = 'Ana'; COMMIT", resultado: "OK" },
      {
        tx: "T2",
        sql: "UPDATE guardias SET activo = false WHERE medico = 'Beto'; COMMIT",
        resultado: {
          "read-committed": "OK",
          "repeatable-read": "OK",
          serializable: "ERROR: could not serialize access due to read/write dependencies",
        },
      },
    ],
    desenlace: {
      "read-committed": {
        correcto: false,
        texto: "Quedan 0 médicos de guardia. Cada transacción modificó una fila distinta, así que no hubo conflicto de escritura que detectar.",
      },
      "repeatable-read": {
        correcto: false,
        texto: "También quedan 0: la snapshot evita lecturas no repetibles, pero no detecta que la decisión de T2 se basó en datos que T1 cambió. Es la anomalía que REPEATABLE READ (snapshot isolation) permite.",
      },
      serializable: {
        correcto: true,
        texto: "Postgres (SSI) detecta el ciclo de dependencias lectura/escritura y aborta T2. Al reintentar, T2 ve 1 médico activo y no puede salir.",
      },
    },
  },
];

export function resultadoPaso(paso: PasoTransaccion, nivel: NivelAislamiento): string {
  return typeof paso.resultado === "string" ? paso.resultado : paso.resultado[nivel];
}

export function esError(resultado: string): boolean {
  return resultado.startsWith("ERROR");
}
