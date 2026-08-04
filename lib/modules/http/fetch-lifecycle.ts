export type EstadoPromise = "pendiente" | "resuelta" | "rechazada";

export interface PasoFetch {
  descripcion: string;
  estadoPromise: EstadoPromise;
  statusCode?: number;
  responseOk?: boolean;
  consola: string[];
}

export interface EscenarioFetch {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoFetch[];
}

export const escenariosFetch: EscenarioFetch[] = [
  {
    slug: "exito-200",
    titulo: "200 OK",
    codigo: [
      "const res = await fetch('/api/usuarios');",
      "console.log(res.ok, res.status);",
      "const datos = await res.json();",
      "console.log(datos);",
    ],
    pasos: [
      {
        descripcion:
          "Se invoca fetch(). Devuelve una Promise que queda pendiente hasta que lleguen los headers de la respuesta.",
        estadoPromise: "pendiente",
        consola: [],
      },
      {
        descripcion:
          "Llega la respuesta con status 200. La Promise de fetch se resuelve con el objeto Response.",
        estadoPromise: "resuelta",
        statusCode: 200,
        responseOk: true,
        consola: [],
      },
      {
        descripcion: "res.ok es true (status entre 200 y 299) y res.status es 200.",
        estadoPromise: "resuelta",
        statusCode: 200,
        responseOk: true,
        consola: ["true 200"],
      },
      {
        descripcion:
          "res.json() parsea el body como JSON. También es asincrónico: leer el body es otra Promise.",
        estadoPromise: "resuelta",
        statusCode: 200,
        responseOk: true,
        consola: ["true 200"],
      },
      {
        descripcion: "Los datos parseados se imprimen.",
        estadoPromise: "resuelta",
        statusCode: 200,
        responseOk: true,
        consola: ["true 200", "{ id: 1, nombre: 'Ana' }"],
      },
    ],
  },
  {
    slug: "error-404",
    titulo: "404 (fetch resuelve igual)",
    codigo: [
      "const res = await fetch('/api/usuarios/9999');",
      "console.log(res.ok, res.status);",
      "const datos = await res.json();",
      "console.log(datos);",
    ],
    pasos: [
      {
        descripcion: "Se invoca fetch(). La Promise queda pendiente.",
        estadoPromise: "pendiente",
        consola: [],
      },
      {
        descripcion:
          "Llega la respuesta con status 404. Importante: un status de error HTTP NO hace que fetch rechace la Promise.",
        estadoPromise: "resuelta",
        statusCode: 404,
        responseOk: false,
        consola: [],
      },
      {
        descripcion:
          "res.ok es false y res.status es 404. Si no chequeás esto explícitamente, el código sigue como si nada.",
        estadoPromise: "resuelta",
        statusCode: 404,
        responseOk: false,
        consola: ["false 404"],
      },
      {
        descripcion: "res.json() intenta parsear el body del error, que puede ser JSON válido igual.",
        estadoPromise: "resuelta",
        statusCode: 404,
        responseOk: false,
        consola: ["false 404"],
      },
      {
        descripcion:
          "Se imprime el body de error como si fuera un dato válido: el bug clásico de no chequear res.ok antes de usar los datos.",
        estadoPromise: "resuelta",
        statusCode: 404,
        responseOk: false,
        consola: ["false 404", "{ error: 'Usuario no encontrado' }"],
      },
    ],
  },
  {
    slug: "error-red",
    titulo: "Error de red",
    codigo: [
      "try {",
      "  const res = await fetch('/api/usuarios');",
      "  const datos = await res.json();",
      "} catch (error) {",
      "  console.log('Falló:', error.message);",
      "}",
    ],
    pasos: [
      {
        descripcion: "Se invoca fetch(). La Promise queda pendiente.",
        estadoPromise: "pendiente",
        consola: [],
      },
      {
        descripcion:
          "No hay conexión (o falla DNS, o CORS bloquea antes de recibir respuesta). No llega ningún status HTTP.",
        estadoPromise: "pendiente",
        consola: [],
      },
      {
        descripcion:
          "Recién acá fetch() rechaza la Promise: un error de red es lo único que dispara el catch, no un status HTTP.",
        estadoPromise: "rechazada",
        consola: [],
      },
      {
        descripcion: "El catch captura el error y lo imprime.",
        estadoPromise: "rechazada",
        consola: ["Falló: Failed to fetch"],
      },
    ],
  },
];
