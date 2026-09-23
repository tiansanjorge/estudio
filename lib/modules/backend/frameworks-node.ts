export type FrameworkId = "express" | "fastify" | "nestjs";

export interface Framework {
  id: FrameworkId;
  nombre: string;
  codigo: string;
}

export const FRAMEWORKS: Framework[] = [
  {
    id: "express",
    nombre: "Express",
    codigo: `const app = express();
app.use(express.json());

app.post("/pedidos", async (req, res, next) => {
  const datos = esquemaPedido.safeParse(req.body);        // validación: la elegís vos
  if (!datos.success) return res.status(400).json(datos.error.issues);
  try {
    const pedido = await pedidos.crear(req.user.id, datos.data);
    res.status(201).json(pedido);
  } catch (err) {
    next(err);                                             // manejo de errores manual
  }
});

app.listen(3000);`,
  },
  {
    id: "fastify",
    nombre: "Fastify",
    codigo: `const app = Fastify({ logger: true });                  // logging (pino) incluido

app.post("/pedidos", {
  schema: {                                                // JSON Schema: valida la entrada
    body: esquemaPedidoJson,                               // y serializa la salida más rápido
    response: { 201: esquemaPedidoCreadoJson },
  },
  handler: async (req, reply) => {
    const pedido = await pedidos.crear(req.user.id, req.body);
    return reply.code(201).send(pedido);                   // async/await nativo
  },
});

await app.listen({ port: 3000 });`,
  },
  {
    id: "nestjs",
    nombre: "NestJS",
    codigo: `@Controller("pedidos")
export class PedidosController {
  constructor(private readonly pedidos: PedidosService) {} // inyección de dependencias

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)                                 // guards, pipes, interceptors
  crear(@Usuario() usuario: UsuarioSesion, @Body() dto: CrearPedidoDto) {
    return this.pedidos.crear(usuario.id, dto);            // DTO validado por ValidationPipe
  }
}

@Module({ controllers: [PedidosController], providers: [PedidosService] })
export class PedidosModule {}`,
  },
];

export interface Criterio {
  nombre: string;
  valores: Record<FrameworkId, string>;
}

export const CRITERIOS: Criterio[] = [
  {
    nombre: "Filosofía",
    valores: {
      express: "Minimalista: routing y middlewares, el resto lo elegís",
      fastify: "Minimalista pero con opiniones: schemas, plugins, logging",
      nestjs: "Framework completo con estructura impuesta (inspirado en Angular)",
    },
  },
  {
    nombre: "Performance (throughput)",
    valores: {
      express: "La más baja de las tres; suficiente para la mayoría de los casos",
      fastify: "La más alta: serialización por schema y un core optimizado",
      nestjs: "Depende del adaptador: sobre Express o sobre Fastify",
    },
  },
  {
    nombre: "Validación y tipos",
    valores: {
      express: "Manual (Zod, Joi) en cada ruta o con un middleware propio",
      fastify: "JSON Schema integrado; type providers para inferir tipos (Zod, TypeBox)",
      nestjs: "DTOs con class-validator y ValidationPipe, o pipes con Zod",
    },
  },
  {
    nombre: "Estructura del proyecto",
    valores: {
      express: "Ninguna: cada equipo inventa la suya",
      fastify: "Encapsulación por plugins",
      nestjs: "Módulos, controllers, providers, DI: consistente entre proyectos",
    },
  },
  {
    nombre: "Curva de aprendizaje",
    valores: {
      express: "Baja",
      fastify: "Baja a media",
      nestjs: "Media a alta: decoradores, DI, ciclo de vida",
    },
  },
];

export interface Escenario {
  id: string;
  descripcion: string;
  recomendado: FrameworkId;
  razon: string;
}

export const ESCENARIOS: Escenario[] = [
  {
    id: "chico",
    descripcion: "API chica o prototipo, equipo de 1-2 personas",
    recomendado: "fastify",
    razon:
      "Simple como Express pero con validación, logging y async/await bien resueltos desde el inicio. Express también sirve si el equipo ya lo domina.",
  },
  {
    id: "enterprise",
    descripcion: "Backend grande, varios equipos, dominio complejo",
    recomendado: "nestjs",
    razon:
      "La estructura impuesta y la inyección de dependencias hacen que todos los módulos se parezcan, facilitan los tests y el onboarding.",
  },
  {
    id: "throughput",
    descripcion: "Servicio de alto tráfico con respuestas simples (gateway, tracking)",
    recomendado: "fastify",
    razon:
      "El overhead del framework importa cuando el handler hace poco: la serialización por schema y el core optimizado dan más requests por segundo.",
  },
  {
    id: "legacy",
    descripcion: "Proyecto existente en Express con muchos middlewares propios",
    recomendado: "express",
    razon:
      "Migrar tiene costo y riesgo; mejor ordenar la estructura y agregar validación. Si el dolor es la falta de estructura, NestJS puede correr sobre Express.",
  },
];
