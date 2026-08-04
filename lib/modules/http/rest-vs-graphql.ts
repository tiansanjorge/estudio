export interface EscenarioComparacion {
  slug: string;
  titulo: string;
  descripcion: string;
  rest: { requests: string[]; comentario: string };
  graphql: { query: string; comentario: string };
}

export const escenariosComparacion: EscenarioComparacion[] = [
  {
    slug: "perfil-con-posts",
    titulo: "Perfil con últimos posts y likes",
    descripcion:
      "Necesitás el nombre y avatar de un usuario, sus últimos 3 posts, y la cantidad de likes de cada uno.",
    rest: {
      requests: [
        "GET /usuarios/42",
        "GET /usuarios/42/posts?limit=3",
        "GET /posts/101/likes",
        "GET /posts/102/likes",
        "GET /posts/103/likes",
      ],
      comentario:
        "5 requests separadas. Encima, GET /usuarios/42 probablemente devuelve más campos de los que necesitás (email, dirección, preferencias): overfetching.",
    },
    graphql: {
      query: `query {
  usuario(id: 42) {
    nombre
    avatar
    posts(limit: 3) {
      titulo
      likes
    }
  }
}`,
      comentario:
        "Una sola request, con exactamente los campos que pediste. El costo se traslada al servidor: resolver esta query anidada puede ser cara (el clásico problema N+1).",
    },
  },
  {
    slug: "catalogo-productos",
    titulo: "Catálogo de productos",
    descripcion:
      "Necesitás una lista de productos donde vas a usar prácticamente todos los campos que devuelve el endpoint.",
    rest: {
      requests: ["GET /productos"],
      comentario:
        "Una sola request, simple, y cacheable por URL en un CDN o por el navegador — algo que GraphQL pierde por default al ir todo por POST a un único endpoint.",
    },
    graphql: {
      query: `query {
  productos {
    id
    nombre
    precio
    stock
  }
}`,
      comentario:
        "Funciona igual de bien, pero acá no hay overfetching que evitar (ya usabas todos los campos), así que la flexibilidad de GraphQL no suma mucho frente a la simplicidad y el cacheo gratis de REST.",
    },
  },
];
