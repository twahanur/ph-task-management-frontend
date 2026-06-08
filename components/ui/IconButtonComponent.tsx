"use client";

import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import DeepGreenSvg from "../svgIcon/DeepGreenSvg";
import DeepRedSvg from "../svgIcon/DeepRedSvg";

type TButtonComponentProps = {
  buttonName?: string;
  icon?: LucideIcon;
  varient?: "green" | "red" | "default";
  clasName?: string;
  borderClass?: string;
  handleSubmit?: () => Promise<void>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButtonComponent = forwardRef<
  HTMLButtonElement,
  TButtonComponentProps
>((props, ref) => {
  const {
    buttonName,
    icon: Icon,
    varient = "default",
    clasName,
    handleSubmit,
    ...rest
  } = props;

  return (
    <button
      ref={ref}
      type="button"
      {...rest}
      className={cn(
        "relative cursor-pointer bg-white/5 rounded-xl py-2 flex items-center justify-center px-2 overflow-hidden ",
        clasName
      )}
    >
      {/* top and bottom line */}
      <div className="absolute top-0 left-0 inset-3 border-l border-t border-white/20 rounded-tl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 inset-3 border-r border-b border-white/20 rounded-br-xl pointer-events-none" />

      {/* Button text */}
      <p className="flex items-center gap-2">
        {Icon && (
          <Icon
            size={16}
            className={
              varient === "green"
                ? "text-[#FCF5EB]"
                : varient === "red"
                ? "text-[#F50F0F]"
                : "text-white"
            }
          />
        )}
        {buttonName && <span className="text-sm">{buttonName}</span>}
      </p>

      {/* Variant effects */}

      {varient === "green" && (
        <>
          <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
            <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,var(--color-success)_50%,transparent_100%)]" />
          </div>
          <div className="pointer-events-none">
            <DeepGreenSvg />
          </div>
        </>
      )}

      {varient === "red" && (
        <>
          <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
            <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(245,15,15,1)_50%,transparent_100%)]" />
          </div>
          <div className="pointer-events-none">
            <DeepRedSvg />
          </div>
        </>
      )}
    </button>
  );
});

IconButtonComponent.displayName = "ButtonComponent";

export default IconButtonComponent;
