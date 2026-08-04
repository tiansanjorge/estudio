"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type Edge = "top" | "bottom" | "left" | "right";
type Phase = "hidden" | "peeking" | "dismissing";

const MIN_INTERVAL_MS = 8 * 60 * 1000;
const MAX_INTERVAL_MS = 12 * 60 * 1000;
const ENTRANCE_DURATION_MS = 600;
const ENTRANCE_DELAY_MS = 150;
const DODGE_DURATION_MS = 200;
const FADE_DURATION_MS = 400;
const DODGES_BEFORE_FADEOUT = 2;
const SIZE_PX = 152;

const EDGES: Edge[] = ["top", "bottom", "left", "right"];

const EDGE_TRANSFORM: Record<Edge, { hidden: string; peeking: string }> = {
  top: { hidden: "translateY(-70%)", peeking: "translateY(-25%)" },
  bottom: { hidden: "translateY(70%)", peeking: "translateY(25%)" },
  left: { hidden: "translateX(-70%)", peeking: "translateX(-25%)" },
  right: { hidden: "translateX(70%)", peeking: "translateX(25%)" },
};

// Rota la foto para que su lado "de arriba" apunte hacia el centro de la pantalla.
const EDGE_ROTATION: Record<Edge, number> = {
  bottom: 0,
  top: 180,
  left: 90,
  right: 270,
};

function randomInterval() {
  return MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
}

function randomEdge(): Edge {
  return EDGES[Math.floor(Math.random() * EDGES.length)];
}

function randomOffsetPercent() {
  return 10 + Math.random() * 70;
}

function randomDodgeDistance() {
  const sign = Math.random() < 0.5 ? -1 : 1;
  return sign * (40 + Math.random() * 20);
}

export function NachoPeek() {
  const [edge, setEdge] = useState<Edge>("bottom");
  const [offset, setOffset] = useState(50);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [entering, setEntering] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [dodgeOffset, setDodgeOffset] = useState(0);
  const scheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const triggerPeek = useCallback(() => {
    if (scheduleRef.current) clearTimeout(scheduleRef.current);
    if (dismissRef.current) clearTimeout(dismissRef.current);
    setEdge(randomEdge());
    setOffset(randomOffsetPercent());
    setDodgeCount(0);
    setDodgeOffset(0);
    setEntering(true);
    setPhase("peeking");

    if (!audioRef.current) {
      audioRef.current = new Audio("/toasty.mp3");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  const scheduleNext = useCallback(() => {
    scheduleRef.current = setTimeout(triggerPeek, randomInterval());
  }, [triggerPeek]);

  useEffect(() => {
    scheduleNext();
    return () => {
      if (scheduleRef.current) clearTimeout(scheduleRef.current);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, [scheduleNext]);

  // Arranca en la posición "hidden" (fuera del viewport) y recién tras un
  // pequeño delay pasa a "peeking", para sincronizar con el silencio inicial
  // del sonido; el navegador anima la transición en vez de pintar directo en
  // la posición final.
  useEffect(() => {
    if (phase !== "peeking" || !entering) return;
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => setEntering(false));
    }, ENTRANCE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [phase, entering]);

  // Dev-only: Shift+N fuerza la aparición al toque, sin esperar el timer real.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === "n") {
        triggerPeek();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerPeek]);

  const handleClick = () => {
    if (phase !== "peeking") return;

    if (dodgeCount < DODGES_BEFORE_FADEOUT) {
      setDodgeCount((count) => count + 1);
      setDodgeOffset((current) => current + randomDodgeDistance());
      return;
    }

    setPhase("dismissing");
    dismissRef.current = setTimeout(() => {
      setPhase("hidden");
      scheduleNext();
    }, FADE_DURATION_MS);
  };

  if (phase === "hidden") return null;

  const isHorizontalEdge = edge === "top" || edge === "bottom";
  const dodgeTranslate = isHorizontalEdge
    ? `translateX(${dodgeOffset}px)`
    : `translateY(${dodgeOffset}px)`;
  const rotate = `rotate(${EDGE_ROTATION[edge]}deg)`;
  const positionTranslate = entering
    ? EDGE_TRANSFORM[edge].hidden
    : `${EDGE_TRANSFORM[edge].peeking} ${dodgeTranslate}`;

  const style: CSSProperties = {
    [edge]: 0,
    [isHorizontalEdge ? "left" : "top"]: `${offset}%`,
    width: SIZE_PX,
    height: SIZE_PX,
    transform: `${positionTranslate} ${rotate}`,
    opacity: phase === "dismissing" || entering ? 0 : 1,
    transitionProperty: "transform, opacity",
    transitionDuration: `${entering ? ENTRANCE_DURATION_MS : DODGE_DURATION_MS}ms, ${
      phase === "dismissing" ? FADE_DURATION_MS : ENTRANCE_DURATION_MS
    }ms`,
  };

  return (
    <div
      aria-hidden="true"
      onClick={handleClick}
      className="fixed z-9999 cursor-pointer ease-out"
      style={style}
    >
      <Image
        src="/nacho.png"
        alt=""
        width={SIZE_PX}
        height={SIZE_PX}
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
}
