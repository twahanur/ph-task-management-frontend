/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import CornerGlowSvg from "../svgIcon/CornerGlowSvg";
import { TVarient } from "./ButtonComponent";
import RedSvgForButton from "../svgIcon/RedSvgForButton";
import ButtonSvgGlow from "../svgIcon/ButtonSvgGlow";
import YellowSVGForButton from "../svgIcon/YellowSVGForButton";
import FulWidthlYellowSvg from "../svgIcon/FulWidthlYellowSvg";
import GreenSvgForButton from "../svgIcon/GreenSvgForButton";
import SuccessButtonSvg from "../svgIcon/SuccessButtonSvg";
import PurpleButtonSvg from "../svgIcon/PurpleButtonSvg";
import LightPurple from "../svgIcon/LightPurple";
import CornerPurpleSvg from "../svgIcon/CornerPurpleSvg";

type Props = {
  name?: string;
  varient?: TVarient;
  icon?: LucideIcon;
  disable?: boolean;
  handleSubmit?: (data?: any) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const TriggeredButton = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      name = "Save",
      varient,
      disable = false,
      icon: Icon,
      handleSubmit,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disable}
        onClick={handleSubmit}
        {...props}
        className="relative cursor-pointer bg-white/5 rounded-2xl py-2 flex items-center justify-center px-4 overflow-hidden"
      >
        <div className="absolute top-0 left-px inset-3 border-l border-t border-white/20 rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-px inset-3 border-r border-b border-white/20 rounded-br-2xl pointer-events-none" />
        {varient === "default" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <CornerGlowSvg />
            </div>
          </>
        )}

        <p className="flex items-center gap-2">
          {Icon && (
            <Icon
              size={18}
              className={
                varient === "green"
                  ? "text-success"
                  : varient === "red"
                    ? "text-[#F50F0F]"
                    : "text-white"
              }
            />
          )}
          {name && <span className="text-sm">{name}</span>}
        </p>

        {/* Variant effects */}
        {varient === "dark yellow" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <CornerGlowSvg />
            </div>
          </>
        )}
        {varient === "light yellow" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <ButtonSvgGlow />
            </div>
          </>
        )}
        {varient === "yellow" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <YellowSVGForButton />
            </div>
          </>
        )}
        {varient === "full yellow" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
            </div>
            <div className="pointer-events-none">
              <FulWidthlYellowSvg />
            </div>
          </>
        )}

        {varient === "green" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,var(--color-success)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <GreenSvgForButton />
            </div>
          </>
        )}
        {varient === "success" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,var(--color-success)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <SuccessButtonSvg />
            </div>
          </>
        )}

        {varient === "red" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(245,15,15,1)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <RedSvgForButton />
            </div>
          </>
        )}
        {varient === "purple" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(220,63,255,1)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <PurpleButtonSvg />
            </div>
          </>
        )}
        {varient === "light purple" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(220,63,255,1)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <LightPurple />
            </div>
          </>
        )}
        {varient === "deep purple" && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
              <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(220,63,255,1)_50%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none">
              <CornerPurpleSvg />
            </div>
          </>
        )}

        <CornerGlowSvg />
      </button>
    );
  },
);

TriggeredButton.displayName = "TriggeredButton";

export default TriggeredButton;
