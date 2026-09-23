export type Responsabilidad = "http" | "negocio" | "datos";

export const RESPONSABILIDADES: { id: Responsabilidad; nombre: string; capa: string; descripcion: string }[] = [
  {
    id: "http",
    nombre: "HTTP",
    capa: "Controller",
    descripcion: "Leer el request, validar la forma, llamar al servicio y traducir el resultado o el error a una respuesta.",
  },
  {
    id: "negocio",
    nombre: "Negocio",
    capa: "Service",
    descripcion: "Las reglas: qué se puede hacer, en qué orden, qué se calcula. No sabe de HTTP ni de SQL.",
  },
  {
    id: "datos",
    nombre: "Datos",
    capa: "Repository",
    descripcion: "Cómo se leen y guardan los datos: consultas, ORM, transacciones.",
  },
];

export interface Linea {
  texto: string;
  resp?: Responsabilidad;
}

export const CONTROLLER_GORDO: Linea[] = [
  { texto: 'app.post("/pedidos/:id/cupon", async (req, res) => {' },
  { texto: "  const { codigo } = req.body;", resp: "http" },
  { texto: '  if (!codigo) return res.status(400).json({ error: "Falta el código" });', resp: "http" },
  { texto: "  const pedido = await prisma.pedido.findUnique({", resp: "datos" },
  { texto: "    where: { id: req.params.id }, include: { items: true },", resp: "datos" },
  { texto: "  });", resp: "datos" },
  { texto: "  if (!pedido) return res.status(404).json({ error: \"No existe\" });", resp: "http" },
  { texto: "  const cupon = await prisma.cupon.findUnique({ where: { codigo } });", resp: "datos" },
  { texto: "  if (!cupon || cupon.vence < new Date())", resp: "negocio" },
  { texto: '    return res.status(422).json({ error: "Cupón inválido" });', resp: "http" },
  { texto: "  const subtotal = pedido.items.reduce((a, i) => a + i.precio * i.cantidad, 0);", resp: "negocio" },
  { texto: "  const descuento = Math.min(subtotal * cupon.porcentaje, cupon.tope);", resp: "negocio" },
  { texto: "  await prisma.pedido.update({", resp: "datos" },
  { texto: "    where: { id: pedido.id }, data: { descuento, cuponId: cupon.id },", resp: "datos" },
  { texto: "  });", resp: "datos" },
  { texto: "  res.json({ total: subtotal - descuento });", resp: "http" },
  { texto: "});" },
];

export const CAPAS_SEPARADAS: { archivo: string; lineas: Linea[] }[] = [
  {
    archivo: "pedidos.controller.ts",
    lineas: [
      { texto: 'app.post("/pedidos/:id/cupon", async (req, res) => {' },
      { texto: "  const { codigo } = AplicarCuponSchema.parse(req.body);", resp: "http" },
      { texto: "  const total = await pedidosService.aplicarCupon(req.params.id, codigo);", resp: "http" },
      { texto: "  res.json({ total });", resp: "http" },
      { texto: "});  // NoEncontrado → 404, CuponInvalido → 422 en el error middleware", resp: "http" },
    ],
  },
  {
    archivo: "pedidos.service.ts",
    lineas: [
      { texto: "async aplicarCupon(pedidoId: string, codigo: string) {" },
      { texto: "  const pedido = await this.pedidos.buscarConItems(pedidoId);", resp: "negocio" },
      { texto: "  if (!pedido) throw new NoEncontrado(\"pedido\", pedidoId);", resp: "negocio" },
      { texto: "  const cupon = await this.cupones.buscarPorCodigo(codigo);", resp: "negocio" },
      { texto: "  if (!cupon || cupon.vence < this.reloj.ahora()) throw new CuponInvalido(codigo);", resp: "negocio" },
      { texto: "  const subtotal = calcularSubtotal(pedido.items);", resp: "negocio" },
      { texto: "  const descuento = Math.min(subtotal * cupon.porcentaje, cupon.tope);", resp: "negocio" },
      { texto: "  await this.pedidos.guardarDescuento(pedido.id, descuento, cupon.id);", resp: "negocio" },
      { texto: "  return subtotal - descuento;", resp: "negocio" },
      { texto: "}" },
    ],
  },
  {
    archivo: "pedidos.repository.ts",
    lineas: [
      { texto: "buscarConItems(id: string) {" },
      { texto: "  return prisma.pedido.findUnique({ where: { id }, include: { items: true } });", resp: "datos" },
      { texto: "}" },
      { texto: "guardarDescuento(id: string, descuento: number, cuponId: string) {" },
      { texto: "  return prisma.pedido.update({ where: { id }, data: { descuento, cuponId } });", resp: "datos" },
      { texto: "}" },
    ],
  },
];
