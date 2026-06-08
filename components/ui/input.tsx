"use client";

import { cn } from "@/lib/utils";

export function Input({
  className,
  type,
  icon,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: React.ReactNode;
  borderRadius?: string;
  sku?: string;
}) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute top-2 left-2 text-white/60 w-4 h-4">
          {icon}
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "text-base font-light outline-none flex items-center gap-3 px-4 py-2 rounded-[12px] transition-[box-shadow,border-color] w-full silver-input",
          className,
        )}
        {...props}
      />
    </div>
  );
}
