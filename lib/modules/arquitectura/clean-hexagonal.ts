export type AdaptadorRepo = "prisma" | "memoria";
export type AdaptadorPagos = "stripe" | "mercadopago" | "fake";

export const NOMBRE_REPO: Record<AdaptadorRepo, string> = {
  prisma: "PrismaPedidosRepo",
  memoria: "PedidosRepoEnMemoria",
};

export const NOMBRE_PAGOS: Record<AdaptadorPagos, string> = {
  stripe: "StripePasarela",
  mercadopago: "MercadoPagoPasarela",
  fake: "PasarelaFake",
};

export interface Capa {
  id: "dominio" | "aplicacion" | "adaptadores";
  nombre: string;
  descripcion: string;
}

export const CAPAS: Capa[] = [
  { id: "dominio", nombre: "Dominio", descripcion: "Entidades y reglas de negocio. No importa nada de afuera." },
  {
    id: "aplicacion",
    nombre: "Aplicación",
    descripcion: "Casos de uso y puertos (interfaces) que declaran lo que necesitan del exterior.",
  },
  {
    id: "adaptadores",
    nombre: "Adaptadores e infraestructura",
    descripcion: "Implementan los puertos con tecnología concreta: HTTP, base de datos, pagos.",
  },
];

export const CODIGO_DOMINIO = `// dominio/pedido.ts
export class Pedido {
  constructor(readonly items: Item[], readonly clienteId: string) {
    if (items.length === 0) throw new Error("Un pedido necesita al menos un ítem");
  }
  total() {
    return this.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  }
}`;

export const CODIGO_PUERTOS = `// aplicacion/puertos.ts
export interface PedidosRepo {
  guardar(pedido: Pedido): Promise<void>;
}
export interface PasarelaPagos {
  cobrar(monto: number, clienteId: string): Promise<{ aprobado: boolean }>;
}`;

export function codigoCasoDeUso(violacion: boolean): string {
  if (violacion) {
    return `// aplicacion/crear-pedido.ts
import { prisma } from "../infra/prisma";   // ✗ depende de la infraestructura
import Stripe from "stripe";                // ✗ depende de un proveedor

export async function crearPedido(datos: DatosPedido) {
  const pedido = new Pedido(datos.items, datos.clienteId);
  const stripe = new Stripe(process.env.STRIPE_KEY!);
  await stripe.paymentIntents.create({ amount: pedido.total(), currency: "ars" });
  await prisma.pedido.create({ data: { ...pedido } });
}`;
  }
  return `// aplicacion/crear-pedido.ts
export class CrearPedido {
  constructor(
    private readonly repo: PedidosRepo,        // puerto
    private readonly pagos: PasarelaPagos,     // puerto
  ) {}

  async ejecutar(datos: DatosPedido) {
    const pedido = new Pedido(datos.items, datos.clienteId);
    const { aprobado } = await this.pagos.cobrar(pedido.total(), pedido.clienteId);
    if (!aprobado) throw new PagoRechazado();
    await this.repo.guardar(pedido);
    return pedido;
  }
}`;
}

export function codigoComposicion(repo: AdaptadorRepo, pagos: AdaptadorPagos): string {
  return `// main.ts (composition root: el único lugar que conoce todo)
const crearPedido = new CrearPedido(
  new ${NOMBRE_REPO[repo]}(${repo === "prisma" ? "prisma" : ""}),
  new ${NOMBRE_PAGOS[pagos]}(${pagos === "fake" ? "{ aprobar: true }" : "config"}),
);

app.post("/pedidos", async (req, res) => {        // adaptador HTTP
  const pedido = await crearPedido.ejecutar(req.body);
  res.status(201).json(pedido);
});`;
}

export interface Consecuencias {
  archivosQueCambian: string[];
  testeableSinInfra: boolean;
  nota: string;
}

export function consecuencias(
  violacion: boolean,
  cambioRepo: boolean,
  cambioPagos: boolean,
): Consecuencias {
  if (violacion) {
    return {
      archivosQueCambian: ["aplicacion/crear-pedido.ts", "y cada caso de uso que use Prisma o Stripe"],
      testeableSinInfra: false,
      nota:
        "La regla de negocio quedó mezclada con Prisma y Stripe: para testearla hace falta una base y mockear un SDK, y cambiar de proveedor obliga a tocar la lógica.",
    };
  }
  const archivos = ["main.ts"];
  if (cambioRepo) archivos.push("adaptadores/pedidos-repo.ts");
  if (cambioPagos) archivos.push("adaptadores/pasarela.ts");
  return {
    archivosQueCambian: archivos,
    testeableSinInfra: true,
    nota:
      "El dominio y el caso de uso no se tocaron: solo cambia qué adaptador se conecta en el composition root. En los tests se conectan el repo en memoria y la pasarela fake.",
  };
}
