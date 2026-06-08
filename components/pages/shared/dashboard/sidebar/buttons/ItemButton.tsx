import React from "react";

type SidebarButtonEffectProps = {
  active?: boolean;
  children: React.ReactNode;
};

const SidebarButtonEffect = ({
  active = false,
  children,
}: SidebarButtonEffectProps) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg transition-all duration-150 group/btn
        ${active 
          ? "bg-gray-250/75 text-gray-900 font-bold" 
          : "text-gray-600 font-medium hover:bg-gray-200/50 hover:text-gray-950"
        }`}
    >
      {/* Left indicator bar when active */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gray-650 rounded-r-md z-20" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SidebarButtonEffect;
