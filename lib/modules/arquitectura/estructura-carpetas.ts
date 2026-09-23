export type Estructura = "capas" | "features";

export const ARBOLES: Record<Estructura, string[]> = {
  capas: [
    "src/components/CarritoItem.tsx",
    "src/components/CuponInput.tsx",
    "src/components/ProductoCard.tsx",
    "src/components/LoginForm.tsx",
    "src/components/Boton.tsx",
    "src/hooks/useCarrito.ts",
    "src/hooks/useProductos.ts",
    "src/hooks/useSesion.ts",
    "src/services/carritoApi.ts",
    "src/services/productosApi.ts",
    "src/services/authApi.ts",
    "src/types/carrito.ts",
    "src/types/producto.ts",
    "src/utils/calcularTotal.ts",
    "src/utils/formatearPrecio.ts",
  ],
  features: [
    "src/features/carrito/components/CarritoItem.tsx",
    "src/features/carrito/components/CuponInput.tsx",
    "src/features/carrito/useCarrito.ts",
    "src/features/carrito/api.ts",
    "src/features/carrito/calcularTotal.ts",
    "src/features/carrito/types.ts",
    "src/features/carrito/index.ts",
    "src/features/catalogo/ProductoCard.tsx",
    "src/features/catalogo/useProductos.ts",
    "src/features/catalogo/api.ts",
    "src/features/catalogo/index.ts",
    "src/features/auth/LoginForm.tsx",
    "src/features/auth/useSesion.ts",
    "src/features/auth/api.ts",
    "src/shared/ui/Boton.tsx",
    "src/shared/formatearPrecio.ts",
  ],
};

export interface Cambio {
  id: string;
  descripcion: string;
  archivos: Record<Estructura, string[]>;
  nota: string;
}

export const CAMBIOS: Cambio[] = [
  {
    id: "cupon",
    descripcion: "Agregar cupones de descuento al carrito",
    archivos: {
      capas: [
        "src/components/CuponInput.tsx",
        "src/hooks/useCarrito.ts",
        "src/services/carritoApi.ts",
        "src/types/carrito.ts",
        "src/utils/calcularTotal.ts",
      ],
      features: [
        "src/features/carrito/components/CuponInput.tsx",
        "src/features/carrito/useCarrito.ts",
        "src/features/carrito/api.ts",
        "src/features/carrito/types.ts",
        "src/features/carrito/calcularTotal.ts",
      ],
    },
    nota:
      "Son los mismos 5 archivos, pero en capas están repartidos en 5 carpetas distintas mezclados con los de otras features; en features, todo lo que cambia junto vive junto.",
  },
  {
    id: "borrar",
    descripcion: "Eliminar el catálogo (se reemplaza por un proveedor externo)",
    archivos: {
      capas: ["src/components/ProductoCard.tsx", "src/hooks/useProductos.ts", "src/services/productosApi.ts", "src/types/producto.ts"],
      features: ["src/features/catalogo/ProductoCard.tsx", "src/features/catalogo/useProductos.ts", "src/features/catalogo/api.ts", "src/features/catalogo/index.ts"],
    },
    nota:
      "En features se borra una carpeta. En capas hay que buscar archivo por archivo, y es fácil dejar código muerto (¿quién más usa types/producto.ts?).",
  },
  {
    id: "boton",
    descripcion: "Cambiar el estilo del botón en toda la app",
    archivos: {
      capas: ["src/components/Boton.tsx"],
      features: ["src/shared/ui/Boton.tsx"],
    },
    nota:
      "Lo verdaderamente compartido vive en shared/. Ahí las dos estructuras se parecen: la diferencia está en el código específico de cada feature.",
  },
];

export function carpetasTocadas(archivos: string[]): number {
  return new Set(archivos.map((a) => a.slice(0, a.lastIndexOf("/")))).size;
}
