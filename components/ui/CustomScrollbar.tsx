"use client";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

type TCustomSAcrollbar = { children: React.ReactNode; className?: string };

export function CustomScrollbar({ children, className }: TCustomSAcrollbar) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(20);
  const [thumbTop, setThumbTop] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateThumb = () => {
      const ratio = el.clientHeight / el.scrollHeight;
      const height = Math.max(20, el.clientHeight * ratio);
      setThumbHeight(height);

      const scrollRatio = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setThumbTop(scrollRatio * (el.clientHeight - height));
    };

    const showScrollbar = () => {
      setIsVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

      // Hide scrollbar 1 second after scrolling stops
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    };

    el.addEventListener("scroll", () => {
      updateThumb();
      showScrollbar();
    });

    updateThumb();

    return () => {
      el.removeEventListener("scroll", () => {
        updateThumb();
        showScrollbar();
      });
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <div className={cn("relative h-full", className)}>
      {/* Scrollable content */}
      <div ref={containerRef} className="overflow-y-scroll h-full no-scrollbar">
        {children}
      </div>

      {/* Custom scroll thumb */}
      <div
        style={{
          height: `${thumbHeight}px`,
          top: `${thumbTop}px`,
          opacity: isVisible ? 1 : 0,
        }}
        className="
          absolute -right-2 w-1 
          z-50
          bg-[rgba(255,255,255,0.35)]
          rounded-full 
          transition-opacity duration-200
        "
      />
    </div>
  );
}
