export type ModeloServicio = "on-premise" | "iaas" | "contenedores" | "serverless" | "saas";
export type Responsable = "cliente" | "proveedor" | "compartido";

export type CapaId =
  | "datos"
  | "identidades"
  | "configuracion"
  | "codigo"
  | "runtime"
  | "sistema-operativo"
  | "virtualizacion"
  | "hardware"
  | "datacenter";

export const MODELOS: { id: ModeloServicio; nombre: string; ejemplo: string }[] = [
  { id: "on-premise", nombre: "On-premise", ejemplo: "servidores propios" },
  { id: "iaas", nombre: "IaaS", ejemplo: "EC2, Compute Engine" },
  { id: "contenedores", nombre: "Contenedores gestionados", ejemplo: "Fargate, Cloud Run" },
  { id: "serverless", nombre: "Serverless", ejemplo: "Lambda, Vercel Functions" },
  { id: "saas", nombre: "SaaS", ejemplo: "Gmail, Salesforce" },
];

// de arriba (lo más cercano al negocio) hacia abajo (lo más físico)
export const CAPAS: { id: CapaId; nombre: string }[] = [
  { id: "datos", nombre: "Datos y su clasificación" },
  { id: "identidades", nombre: "Identidades y accesos (IAM)" },
  { id: "configuracion", nombre: "Configuración (red, buckets, reglas)" },
  { id: "codigo", nombre: "Código de la aplicación" },
  { id: "runtime", nombre: "Runtime y dependencias" },
  { id: "sistema-operativo", nombre: "Sistema operativo y parches" },
  { id: "virtualizacion", nombre: "Virtualización" },
  { id: "hardware", nombre: "Hardware y red física" },
  { id: "datacenter", nombre: "Datacenter físico" },
];

const C: Responsable = "cliente";
const P: Responsable = "proveedor";
const X: Responsable = "compartido";

export const MATRIZ: Record<ModeloServicio, Record<CapaId, Responsable>> = {
  "on-premise": {
    datos: C, identidades: C, configuracion: C, codigo: C, runtime: C,
    "sistema-operativo": C, virtualizacion: C, hardware: C, datacenter: C,
  },
  iaas: {
    datos: C, identidades: C, configuracion: C, codigo: C, runtime: C,
    "sistema-operativo": C, virtualizacion: P, hardware: P, datacenter: P,
  },
  // la imagen (con sus librerías de sistema) es tuya; el SO del host, del proveedor
  contenedores: {
    datos: C, identidades: C, configuracion: C, codigo: C, runtime: C,
    "sistema-operativo": X, virtualizacion: P, hardware: P, datacenter: P,
  },
  // el proveedor parchea el runtime de Node; tus dependencias de npm siguen siendo tuyas
  serverless: {
    datos: C, identidades: C, configuracion: C, codigo: C, runtime: X,
    "sistema-operativo": P, virtualizacion: P, hardware: P, datacenter: P,
  },
  saas: {
    datos: C, identidades: C, configuracion: X, codigo: P, runtime: P,
    "sistema-operativo": P, virtualizacion: P, hardware: P, datacenter: P,
  },
};

export interface Incidente {
  descripcion: string;
  capa: CapaId;
}

export const INCIDENTES: Incidente[] = [
  { descripcion: "Un bucket con datos de clientes quedó público", capa: "configuracion" },
  { descripcion: "Se filtraron las credenciales de un empleado sin MFA", capa: "identidades" },
  { descripcion: "Una dependencia tiene una vulnerabilidad conocida", capa: "runtime" },
  { descripcion: "Una vulnerabilidad del kernel sin parchear", capa: "sistema-operativo" },
  { descripcion: "Falla un disco del servidor físico", capa: "hardware" },
];

export const NOTAS_COMPARTIDO: Partial<Record<ModeloServicio, Partial<Record<CapaId, string>>>> = {
  contenedores: { "sistema-operativo": "la imagen es tuya, el host es del proveedor" },
  serverless: { runtime: "el proveedor parchea Node; tus dependencias son tuyas" },
  saas: { configuracion: "el proveedor da las opciones; elegirlas bien es tuyo" },
};
