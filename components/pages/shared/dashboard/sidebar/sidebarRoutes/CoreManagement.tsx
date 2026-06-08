import SidebarButtonSvg from "@/components/svgIcon/SidebarButtonSvg";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import SubItemButton from "@/components/pages/shared/dashboard/sidebar/buttons/SubItemButton";

import { matchRoute } from "@/utills/matchRoute";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SidebarButtonEffect from "../buttons/ItemButton";
import { NavRoute } from "@/constants/CRM_Navigation";

type TCoreManagementRoute = {
  sidebarRoutes: NavRoute[];
  singleRoute?: NavRoute;
  platform?: string;
};

const CoreManagement = ({
  sidebarRoutes,
  singleRoute,
  platform,
}: TCoreManagementRoute) => {
  const pathname = usePathname();
  const [open, setOpen] = useState<number | null>(null);
  const isActiveCommunication = pathname === singleRoute?.path;

  return (
    <div>
      {platform && sidebarRoutes?.length > 0 && platform !== "Others" && (
        <SidebarGroupLabel>{platform}</SidebarGroupLabel>
      )}

      <SidebarMenu className="gap-0">
        {sidebarRoutes.map((item, i) => {
          const isActive = item?.path ? matchRoute(pathname, item.path) : false;

          const isChildActive = item.children?.some((child) =>
            child.path ? matchRoute(pathname, child.path) : false,
          );

          if (!item.children || item.children.length === 0) {
            return (
              <SidebarMenuItem key={i} className="w-full">
                {item.path ? (
                  <Link href={item.path}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      className=" px-0"
                    >
                      <button className="w-full text-left cursor-pointer ">
                        <SidebarButtonEffect active={isActive}>
                          <div className="relative z-10 flex w-full items-center justify-between px-2 group-data-[collapsible=icon]:p-2.5 py-1.5">
                            <p className="flex items-center gap-2">
                              <span>
                                {item.icon && <item.icon size={14} />}
                              </span>
                              <span className="text-xs">{item.title}</span>
                            </p>
                          </div>
                        </SidebarButtonEffect>
                      </button>
                    </SidebarMenuButton>
                  </Link>
                ) : (
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <button className="w-full text-left cursor-pointer">
                      <SidebarButtonEffect active={isActive}>
                        <div className="flex items-center gap-2 px-2 py-1.5">
                          {item.icon && <item.icon size={14} />}
                          <span className="text-xs">{item.title}</span>
                        </div>
                      </SidebarButtonEffect>
                    </button>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          }

          // If the item has children
          return (
            <Collapsible
              key={i}
              asChild
              defaultOpen={isChildActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {singleRoute && (
                  <SubItemButton
                    isActive={isActiveCommunication}
                    subItem={singleRoute}
                  />
                )}
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="w-full px-0"
            
                  >
                    <button className="w-full text-left cursor-pointer overflow-hidden rounded-lg group/btn">
                      <SidebarButtonEffect>
                        <div className="relative z-10 flex w-full  px-2 items-center justify-between group-data-[collapsible=icon]:p-2.5 py-1.5 ">
                          <p className="flex items-center gap-2">
                            <span>{item.icon && <item.icon size={14} />}</span>
                            <span className="text-xs">{item.title}</span>
                          </p>
                          <p>
                            <Plus
                              size={14}
                              className="transition-all duration-200 group-data-[state=open]/collapsible:hidden"
                            />
                            <Minus
                              size={14}
                              className="hidden transition-all duration-200 group-data-[state=open]/collapsible:block"
                            />
                          </p>
                        </div>
                      </SidebarButtonEffect>

                      
                    </button>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item?.children?.map((subItem, i) => {
                      const isActive = subItem?.path
                        ? matchRoute(pathname, subItem.path)
                        : false;

                      const visibleChildrenRoute = subItem?.children
                        ? subItem?.children
                        : [];
                      const hasChildren =
                        subItem?.children && subItem?.children.length > 0
                          ? true
                          : false;
                      return (
                        <SidebarMenuSubItem
                          key={i}
                          active={isActive}
                          hasChildren={hasChildren}
                        >
                          {subItem?.children && subItem?.children.length ? (
                            <SidebarMenu>
                              <Collapsible key={i} asChild>
                                <SidebarMenuItem>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                      asChild
                                      tooltip={subItem.title}
                                      hasChildren={hasChildren}
                                    >
                                      <button
                                        className="relative w-full cursor-pointer text-base overflow-hidden rounded-lg group/btn "
                                        onClick={() =>
                                          setOpen(open === i ? null : i)
                                        }
                                      >
                                        {/* Hover glow */}
                                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200">
                                          <SidebarButtonSvg />
                                        </div>

                                        {/* Borders */}
                                        <div className="pointer-events-none absolute top-0 left-px inset-1.5 border-l border-t border-white/20 rounded-tl-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />

                                        <div className="pointer-events-none absolute bottom-0 right-px inset-1.5 border-r border-b border-white/20 rounded-br-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />

                                        {/* Bottom gradient */}
                                        <div className="pointer-events-none absolute bottom-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200">
                                          <span className="block h-[1.5px] w-full bg-[linear-gradient(to_right,rgba(255,177,63,0)_0%,#FFB13F_50%,rgba(255,177,63,0)_100%)]" />
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 flex w-full items-center justify-between pl-1 pr-2 py-1.5 ">
                                          <p className="flex items-center gap-2">
                                            <span className="text-xs">
                                              {subItem.title}
                                            </span>
                                          </p>

                                          {/* ✅ Open / close icons */}
                                          <p className="flex items-center">
                                            {open === i ? (
                                              <Minus size={14} />
                                            ) : (
                                              <Plus size={14} />
                                            )}
                                          </p>
                                        </div>
                                      </button>
                                    </SidebarMenuButton>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent>
                                    <SidebarMenuSub className="pl-0">
                                      {visibleChildrenRoute?.map(
                                        (childItem, index) => {
                                          const isActive = childItem.path
                                            ? matchRoute(
                                                pathname,
                                                childItem.path,
                                              )
                                            : false;
                                          return (
                                            <SidebarMenuSubItem
                                              key={index}
                                              active={isActive}
                                              
                                            >
                                              <SubItemButton
                                                isActive={isActive}
                                                subItem={childItem}
                                              />
                                            </SidebarMenuSubItem>
                                          );
                                        },
                                      )}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </SidebarMenuItem>
                              </Collapsible>
                            </SidebarMenu>
                          ) : (
                            <SubItemButton
                              isActive={isActive}
                              subItem={subItem}
                            />
                          )}
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </div>
  );
};

export default CoreManagement;
