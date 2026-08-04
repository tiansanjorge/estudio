export type MetodoCors = "GET" | "POST-form" | "POST-json" | "PUT";

export interface ConfiguracionCors {
  metodo: MetodoCors;
  origenPermitido: boolean;
}

export interface ResultadoCors {
  requierePreflight: boolean;
  resultado: "permitido" | "bloqueado";
  pasos: string[];
}

function esRequestSimple(metodo: MetodoCors): boolean {
  return metodo === "GET" || metodo === "POST-form";
}

export function evaluarCors({ metodo, origenPermitido }: ConfiguracionCors): ResultadoCors {
  const pasos: string[] = [];

  if (!esRequestSimple(metodo)) {
    pasos.push(
      "La petición no es 'simple' (método o Content-Type no estándar): el navegador manda primero un preflight OPTIONS.",
    );
    if (!origenPermitido) {
      pasos.push(
        "El servidor responde el preflight sin incluir tu origen en Access-Control-Allow-Origin.",
      );
      pasos.push("El navegador bloquea la petición real: nunca llega a mandarse al servidor.");
      return { requierePreflight: true, resultado: "bloqueado", pasos };
    }
    pasos.push("El servidor responde el preflight autorizando tu origen, método y headers.");
    pasos.push("El navegador manda la petición real.");
    pasos.push("El servidor responde y el navegador deja que el JS lea la respuesta.");
    return { requierePreflight: true, resultado: "permitido", pasos };
  }

  pasos.push("La petición es 'simple': el navegador la manda directo, sin preflight.");
  pasos.push("El servidor la recibe y la procesa igual (esto pasa aunque después se bloquee la lectura).");
  if (!origenPermitido) {
    pasos.push("La respuesta llega sin tu origen en Access-Control-Allow-Origin.");
    pasos.push("El navegador bloquea que el JS lea la respuesta, aunque el servidor ya la procesó.");
    return { requierePreflight: false, resultado: "bloqueado", pasos };
  }
  pasos.push("La respuesta incluye tu origen en Access-Control-Allow-Origin.");
  pasos.push("El navegador deja que el JS lea la respuesta normalmente.");
  return { requierePreflight: false, resultado: "permitido", pasos };
}
