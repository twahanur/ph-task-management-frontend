"use client";

import React, { useEffect } from "react";

export default function MobileDragDropProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      // Register a passive listener workaround for touchmove to allow preventing scroll on touch devices (e.g. iOS Safari)
      try {
        window.addEventListener("touchmove", () => {}, { passive: false });
      } catch (e) {
        console.warn("Failed to register non-passive touchmove event listener:", e);
      }

      // Dynamic import to avoid SSR errors
      Promise.all([
        import("mobile-drag-drop"),
        import("mobile-drag-drop/scroll-behaviour")
      ]).then(([{ polyfill }, { scrollBehaviourDragImageTranslateOverride }]) => {
        polyfill({
          // dragImageTranslateOverride allows positioning the ghost image correctly while page is scrolled
          dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
          holdToDrag: 10, // require user to tap and hold for 150ms before starting drag (feels much more responsive)
        });
      }).catch(err => {
        console.error("Failed to load mobile-drag-drop polyfill:", err);
      });
    }
  }, []);

  return <>{children}</>;
}
