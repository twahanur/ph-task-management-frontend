"use client";

import Link from "next/link";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { NavRoute } from "@/constants/CRM_Navigation";

export type SubItemButtonProps = {
  isActive: boolean;
  subItem: NavRoute;
};

const SubItemButton = ({ isActive, subItem }: SubItemButtonProps) => {
  return (
    <SidebarMenuSubButton asChild>
      <button
        className={`relative cursor-pointer bg-transparent border-none rounded-lg py-1.5 flex justify-start items-center px-2 overflow-hidden w-full transition-colors duration-150
          ${isActive 
            ? "text-gray-900 bg-gray-250/50 font-bold" 
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
          }`}
      >
        {/* Link text */}
        {subItem?.path && (
          <Link
            href={subItem?.path}
            className={`relative z-10 w-full text-xs font-normal text-left flex items-center gap-2.5 ${
              subItem.icon && "pl-1"
            }`}
          >
            {subItem.icon && <subItem.icon size={13} className={isActive ? "text-gray-805" : "text-gray-400"} />}
            <span className={isActive ? "text-gray-900 font-bold" : "text-gray-650"}>{subItem.title}</span>
          </Link>
        )}
      </button>
    </SidebarMenuSubButton>
  );
};

export default SubItemButton;
