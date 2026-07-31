"use client";

import { useEffect, useRef, useState } from "react";

type State = "hidden" | "visible" | "leaving";

export function useCardAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<State>("hidden");

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    // Observer for popping in
    const centerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
        } else if (
          entry.boundingClientRect.top >
          window.innerHeight / 2
        ) {
          // Card moved back above center
          setState("hidden");
        }
      },
      {
        threshold: 0.4,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    // Observer for popping out
    const bottomObserver = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;

        if (
          state === "visible" &&
          Math.abs(rect.bottom - window.innerHeight) < 5
        ) {
          setState("leaving");
        }

        if (
          state === "leaving" &&
          rect.bottom > window.innerHeight + 10
        ) {
          setState("visible");
        }
      },
      {
        threshold: 0,
      }
    );

    centerObserver.observe(element);
    bottomObserver.observe(element);

    return () => {
      centerObserver.disconnect();
      bottomObserver.disconnect();
    };
  }, [state]);

  return {
    ref,
    state,
  };
}