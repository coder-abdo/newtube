"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { mainSectionItems } from "@/modules/home/constants";
import { useMainSection } from "@/modules/home/hooks/useMainSection";
import Link from "next/link";

export const MainSection = () => {
  const { handleClick } = useMainSection();
  return (
    <SidebarGroup className="flex">
      <SidebarGroupContent>
        <SidebarMenu>
          {mainSectionItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false} // TODO: change to be active on the chosen path
                onClick={(e: MouseEvent | any) => handleClick(e, item)} // TODO: handle click
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
