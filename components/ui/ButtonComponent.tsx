/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import CornerGlowSvg from "../svgIcon/CornerGlowSvg";
import { cn } from "@/lib/utils";
import GreenSvgForButton from "../svgIcon/GreenSvgForButton";
import RedSvgForButton from "../svgIcon/RedSvgForButton";
import ButtonSvgGlow from "../svgIcon/ButtonSvgGlow";
import YellowSVGForButton from "../svgIcon/YellowSVGForButton";
import PurpleButtonSvg from "../svgIcon/PurpleButtonSvg";
import LightPurple from "../svgIcon/LightPurple";
import CornerPurpleSvg from "../svgIcon/CornerPurpleSvg";
import SuccessButtonSvg from "../svgIcon/SuccessButtonSvg";
import FulWidthlYellowSvg from "../svgIcon/FulWidthlYellowSvg";

export type TVarient =
  | "green"
  | "yellow"
  | "red"
  | "dark yellow"
  | "light yellow"
  | "full yellow"
  | "purple"
  | "light purple"
  | "deep purple"
  | "success"
  | "default";

type TButtonComponentProps = {
  buttonName?: string;
  icon?: LucideIcon;
  varient?: TVarient;
  clasName?: string;
  borderClass?: string;
  handleSubmit?: (
    data?: any,
  ) => void | Promise<void>;
  disable?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonComponent = forwardRef<HTMLButtonElement, TButtonComponentProps>(
  (props, ref) => {
    const {
      buttonName,
      icon: Icon,
      varient = "default",
      clasName,
      handleSubmit,
      disable = false,
      ...rest
    } = props;

    const isSilver = clasName?.includes("silver-btn");

    return (
      <button
        ref={ref}
        type="button"
        disabled={disable}
        {...rest}
        onClick={handleSubmit || rest.onClick}
        className={cn(
          "relative cursor-pointer rounded-xl py-2 flex items-center justify-center px-4 overflow-hidden disabled:cursor-not-allowed",
          !isSilver && "bg-white/5",
          clasName,
        )}
      >
        {/* top and bottom line */}
        {!isSilver && (
          <>
            <div className="absolute top-0 left-0 inset-3 border-l border-t border-white/20 rounded-tl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 inset-3 border-r border-b border-white/20 rounded-br-xl pointer-events-none" />
          </>
        )}

        {/* Button text */}
        <p className="flex items-center gap-2">
          {Icon && (
            <Icon
              size={18}
              className={
                varient === "green"
                  ? "text-success"
                  : varient === "red"
                    ? "text-[#F50F0F]"
                    : isSilver
                      ? "text-[#111827]"
                      : "text-white"
              }
            />
          )}
          {buttonName && <span className={cn("text-sm", isSilver && "text-[#111827] font-semibold")}>{buttonName}</span>}
        </p>

        {/* Variant effects */}
        {!isSilver && varient === "dark yellow" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <CornerGlowSvg />
            </div>
          </>
        )}
        {!isSilver && varient === "light yellow" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <ButtonSvgGlow />
            </div>
          </>
        )}
        {!isSilver && varient === "yellow" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <YellowSVGForButton />
            </div>
          </>
        )}
        {!isSilver && varient === "full yellow" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <FulWidthlYellowSvg />
            </div>
          </>
        )}

        {!isSilver && varient === "green" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,var(--color-success)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <GreenSvgForButton />
            </div>
          </>
        )}
        {!isSilver && varient === "success" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,var(--color-success)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <SuccessButtonSvg />
            </div>
          </>
        )}

        {!isSilver && varient === "red" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(245,15,15,1)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <RedSvgForButton />
            </div>
          </>
        )}
        {!isSilver && varient === "purple" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(220,63,255,1)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <PurpleButtonSvg />
            </div>
          </>
        )}
        {!isSilver && varient === "light purple" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(220,63,255,1)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <LightPurple />
            </div>
          </>
        )}
        {!isSilver && varient === "deep purple" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(220,63,255,1)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <CornerPurpleSvg />
            </div>
          </>
        )}
      </button>
    );
  },
);

ButtonComponent.displayName = "ButtonComponent";

export default ButtonComponent;
