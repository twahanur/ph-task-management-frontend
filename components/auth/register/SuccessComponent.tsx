"use client";

import CheckIconSvg from "@/components/svgIcon/CheckIconSvg";
import SuccessLightSvg from "@/components/svgIcon/SuccessLightSvg";
import IndicatorButtonComponent from "@/components/ui/IndicatorButtonComponent";
import { ArrowRight } from "lucide-react";

const SuccessComponent = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="w-full h-full relative z-10 min-h-screen bg-[#030115] overflow-hidden flex items-center justify-center">
      <SuccessLightSvg color="#0CAF60" />

      <div className="rounded-2xl bg-[linear-gradient(180deg,rgba(43,43,43,0.08)_0%,rgba(32,32,32,0)_100%)] p-8 relative max-w-md">
        {/* border top and bottom */}
        <div className="absolute top-0 left-0 inset-3 border-l border-t border-[#221F33] rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 inset-3 border-r border-b border-[#221F33] rounded-br-2xl pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <CheckIconSvg />
          </div>
          <h1 className="text-center text-3xl font-semibold bg-[linear-gradient(272deg,#00A656_8.42%,#FFF_45.97%,#00A656_84.56%)] bg-clip-text text-transparent ">
            {title}
          </h1>
          <p className="text-[#D8D8D8] font-medium text-sm text-center">
            {content}
          </p>

          <IndicatorButtonComponent
            text="Go To Login"
            icon={ArrowRight}
            varient="green"
            path="/login"
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessComponent;
