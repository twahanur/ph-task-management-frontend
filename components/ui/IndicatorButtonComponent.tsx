import { LucideIcon } from "lucide-react";
import Link from "next/link";
import SuccessButtonSvg from "../svgIcon/SuccessButtonSvg";
import FaildButtonSvg from "../svgIcon/FaildButtonSvg";

type TIndicatorprops = {
  path: string;
  varient: "green" | "red";
  text: string;
  icon?: LucideIcon;
};

const IndicatorButtonComponent = ({
  path,
  varient,
  text,
  icon: Icon,
}: TIndicatorprops) => {
  return (
    <Link
      href={path}
      className={`relative w-full py-2 flex items-center justify-center gap-2 cursor-pointer bg-white/10 rounded-xl overflow-hidden text-white`}>
      {/* top and bottom border */}
      <div className="absolute top-0 left-px inset-2.5 border-l border-t border-white/40 rounded-tl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-px inset-2.5 border-r border-b border-white/40 rounded-br-xl pointer-events-none" />

      {varient === "green" && (
        <>
          <SuccessButtonSvg />
          <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
            <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(5,189,61,1)_50%,transparent_100%)]" />
          </div>
        </>
      )}
      {varient === "red" && (
        <>
          <FaildButtonSvg />
          <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 z-20">
            <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,transparent_0%,rgba(234,24,36,1)_50%,transparent_100%)]" />
          </div>
        </>
      )}

      {/* Button text */}
      <span>{text}</span>
      {Icon && (
        <span>
          <Icon size={16} />
        </span>
      )}
    </Link>
  );
};

export default IndicatorButtonComponent;
