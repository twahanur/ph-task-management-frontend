"use client";

import CrossIconSvg from "@/components/svgIcon/CrossIconSvg";
import SuccessLightSvg from "@/components/svgIcon/SuccessLightSvg";
import IndicatorButtonComponent from "@/components/ui/IndicatorButtonComponent";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

type TFaildComponent = {
  title: string;
  content: string;
  children?: ReactNode;
  buttonText?: string;
  path?: string;
};

const FaildComponent = ({
  title,
  content,
  children,
  buttonText = "Go To Login",
  path = "/login",
}: TFaildComponent) => {
  return (
    <div className="w-full h-full relative z-10 min-h-screen bg-[#030115] overflow-hidden flex items-center justify-center">
      <SuccessLightSvg color="#F73F3F" />

      <div className="rounded-2xl bg-[linear-gradient(180deg,rgba(43,43,43,0.08)_0%,rgba(32,32,32,0)_100%)] p-8 relative max-w-sm">
        {/* border top and bottom */}
        <div className="absolute top-0 left-0 inset-3 border-l border-t border-[#221F33] rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 inset-3 border-r border-b border-[#221F33] rounded-br-2xl pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <CrossIconSvg />
          </div>
          <h1 className="text-center text-3xl font-semibold leading-[42px] bg-[linear-gradient(270deg,#EA1824_20.59%,#FFF_49.25%,#EA1824_78.69%)] bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-[#D8D8D8] font-medium text-sm text-center">
            {content}
          </p>

          {children && children}

          <IndicatorButtonComponent
            text={buttonText}
            icon={ArrowRight}
            varient="red"
            path={path}
          />
        </div>
      </div>
    </div>
  );
};

export default FaildComponent;
