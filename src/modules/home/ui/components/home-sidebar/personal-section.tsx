"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { personalItems } from "@/modules/home/constants";
import { useMainSection } from "@/modules/home/hooks/useMainSection";

import Link from "next/link";
import { MouseEvent } from "react";

export const PersonalSection = () => {
  const { handleClick } = useMainSection();
  return (
    <SidebarGroup className="flex">
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {personalItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false} // TODO: change to be active on the chosen path
                onClick={(e: MouseEvent | any) => {
                  handleClick(e, item);
                }}
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
