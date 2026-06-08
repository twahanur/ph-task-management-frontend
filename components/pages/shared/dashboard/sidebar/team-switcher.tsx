"use client";

import * as React from "react";
import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import TooltipComponent from "@/components/ui/TooltipComponent";

function RemoteLogo({ url }: { url: string }) {
  return (
    <Image
      src={url}
      alt="Company Logo"
      width={32}
      height={32}
      className="object-contain w-full h-full"
      unoptimized
    />
  );
}

function DefaultLogo() {
  return (
    <div className="w-full h-full bg-gray-750 flex items-center justify-center text-white font-bold text-sm rounded-lg">
      PT
    </div>
  );
}

export function TeamSwitcher({
  name,
  plan,
  logoUrl,
}: {
  name: string;
  plan: string;
  logoUrl?: string | null;
}) {
  const { state } = useSidebar();
  const trimedName = name.length > 10 ? name.slice(0, 10) + "..." : name;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between">
          <Link href={"/"}>
            <div className="flex items-center gap-3">
              <div 
                className="flex aspect-square size-9 items-center justify-center rounded-lg overflow-hidden"
              >
                {logoUrl ? <RemoteLogo url={logoUrl} /> : <DefaultLogo />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-gray-800"> <TooltipComponent name={name} trimedName={trimedName} /></span>
                <span className="truncate text-xs text-gray-500">{plan}</span>
              </div>
            </div>
          </Link>
          {state === "expanded" && <SidebarTrigger />}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
