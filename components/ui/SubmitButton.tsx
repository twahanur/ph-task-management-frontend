"use client";

import { LucideIcon } from "lucide-react";
import LargeYellowSvg from "../svgIcon/LargeYellowSvg";
import { cn } from "@/lib/utils";

type TSubmittonButtonProps = {
  isSubmitting?: boolean;
  title: string;
  type?: "button" | "submit" | "reset";
  icon?: LucideIcon;
  varient?: "yellow" | "default";
  clasName?: string;
  handleSubmit?: () => Promise<void>;
};

const SubmitButton = ({
  isSubmitting,
  title,
  icon: Icon,
  type = "submit",
  varient = "yellow",
  clasName,
  handleSubmit,
}: TSubmittonButtonProps) => {
  return (
    <button
      onClick={handleSubmit}
      type={type}
      disabled={isSubmitting}
      className={cn(
        "relative cursor-pointer bg-white/5 rounded-xl py-3 flex items-center justify-center px-4 overflow-hidden w-full text-white effect-no-bg",
        clasName,
      )}
    >
      {varient === "yellow" && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
          <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
        </div>
      )}

      {varient === "yellow" && (
        <div className="pointer-events-none">
          <LargeYellowSvg />
        </div>
      )}

      {/* Button text */}
      <p className="flex items-center gap-2">
        <span>{title}</span>
        {Icon && <Icon size={18} />}
      </p>
    </button>
  );
};

export default SubmitButton;
