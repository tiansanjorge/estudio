export interface ConfigRed {
  internetGateway: boolean;
  natGateway: boolean;
  sgAlbPublico: boolean;
  sgApiDesdeAlb: boolean;
  sgRdsDesdeApi: boolean;
  // la mala práctica: la base en una subred pública, con IP pública y el puerto abierto a todos
  rdsExpuesto: boolean;
}

export const INTERRUPTORES: { clave: keyof ConfigRed; etiqueta: string }[] = [
  { clave: "internetGateway", etiqueta: "Internet Gateway adjunto a la VPC (ruta 0.0.0.0/0 en las subredes públicas)" },
  { clave: "natGateway", etiqueta: "NAT Gateway en una subred pública (ruta 0.0.0.0/0 en las privadas)" },
  { clave: "sgAlbPublico", etiqueta: "SG del ALB: permite 443 desde 0.0.0.0/0" },
  { clave: "sgApiDesdeAlb", etiqueta: "SG de la API: permite 8080 desde el SG del ALB" },
  { clave: "sgRdsDesdeApi", etiqueta: "SG de RDS: permite 5432 desde el SG de la API" },
  { clave: "rdsExpuesto", etiqueta: "RDS en subred pública, accesible y con 5432 abierto a todos (mala práctica)" },
];

export const CONFIG_INICIAL: ConfigRed = {
  internetGateway: true,
  natGateway: false,
  sgAlbPublico: true,
  sgApiDesdeAlb: true,
  sgRdsDesdeApi: false,
  rdsExpuesto: false,
};

export interface Salto {
  descripcion: string;
  ok: boolean;
  motivo: string;
}

export interface Recorrido {
  titulo: string;
  // si el recorrido debería funcionar en una red bien armada
  deseado: boolean;
  saltos: Salto[];
}

// corta en el primer salto que falla, como un paquete real
function recorrer(saltos: Salto[]): Salto[] {
  const indice = saltos.findIndex((s) => !s.ok);
  return indice === -1 ? saltos : saltos.slice(0, indice + 1);
}

export function trazar(c: ConfigRed): Recorrido[] {
  return [
    {
      titulo: "Usuario en internet → ALB → API",
      deseado: true,
      saltos: recorrer([
        { descripcion: "Internet → subred pública", ok: c.internetGateway, motivo: c.internetGateway ? "entra por el Internet Gateway" : "sin Internet Gateway la VPC no tiene conexión con internet" },
        { descripcion: "→ ALB :443", ok: c.sgAlbPublico, motivo: c.sgAlbPublico ? "el SG del ALB acepta HTTPS desde cualquier IP" : "el SG del ALB no acepta tráfico entrante: timeout" },
        { descripcion: "ALB → API :8080 (subred privada)", ok: c.sgApiDesdeAlb, motivo: c.sgApiDesdeAlb ? "el SG de la API acepta al SG del ALB" : "el SG de la API no acepta al ALB: el health check falla y el ALB responde 502/503" },
      ]),
    },
    {
      titulo: "API (subred privada) → API de pagos en internet",
      deseado: true,
      saltos: recorrer([
        { descripcion: "API → ruta 0.0.0.0/0 de la subred privada", ok: c.natGateway, motivo: c.natGateway ? "la ruta apunta al NAT Gateway" : "la subred privada no tiene ruta a internet: la llamada queda colgada hasta el timeout" },
        { descripcion: "NAT Gateway → internet", ok: c.internetGateway, motivo: c.internetGateway ? "el NAT sale por el Internet Gateway con su IP pública" : "el NAT no sirve sin Internet Gateway" },
      ]),
    },
    {
      titulo: "Atacante en internet → RDS :5432",
      deseado: false,
      saltos: recorrer([
        { descripcion: "Internet → subred de RDS", ok: c.rdsExpuesto && c.internetGateway, motivo: c.rdsExpuesto ? (c.internetGateway ? "la base está en una subred pública con IP pública" : "sin Internet Gateway no hay camino") : "RDS está en una subred privada: no hay ruta desde internet" },
        { descripcion: "→ RDS :5432", ok: c.rdsExpuesto, motivo: "el SG acepta 5432 desde 0.0.0.0/0: solo queda la contraseña" },
      ]),
    },
    {
      titulo: "API → RDS :5432",
      deseado: true,
      saltos: recorrer([
        { descripcion: "API → RDS (dentro de la VPC)", ok: true, motivo: "hay ruta local entre subredes de la misma VPC" },
        { descripcion: "→ SG de RDS", ok: c.sgRdsDesdeApi || c.rdsExpuesto, motivo: c.sgRdsDesdeApi ? "el SG de RDS acepta al SG de la API" : c.rdsExpuesto ? "entra porque el puerto está abierto a todos, no porque esté bien configurado" : "el SG de RDS no acepta a la API: la conexión da timeout" },
      ]),
    },
  ];
}

export function llega(recorrido: Recorrido): boolean {
  return recorrido.saltos.every((s) => s.ok);
}
