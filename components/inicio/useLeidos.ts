"use client";

import { useEffect, useState } from "react";
import { EVENTO_PROGRESO_CAMBIO, leerLeidos } from "@/lib/modules/progreso";

/** Set completo de claves "<categoriaSlug>/<moduloSlug>" marcadas como leídas, reactivo a cambios en esta pestaña. */
export function useLeidos(): Set<string> {
  const [leidos, setLeidos] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeidos(leerLeidos());

    function sincronizar() {
      setLeidos(leerLeidos());
    }
    window.addEventListener(EVENTO_PROGRESO_CAMBIO, sincronizar);
    return () => window.removeEventListener(EVENTO_PROGRESO_CAMBIO, sincronizar);
  }, []);

  return leidos;
}
