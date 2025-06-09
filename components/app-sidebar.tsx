"use client";

import * as React from "react";
import { Laptop } from "lucide-react";
import { NavChatHistory } from "@/components/nav-chat-history";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}

interface AppSidebarProps {
  onChatSelect?: (chatId: string) => void;
  onChatDelete?: (chatId: string) => void;
  user?: User;
  [key: string]: any;
}

interface AppSidebarRef {
  saveChatHistory: (idea: string, results: any) => string | null;
  resetCurrentChat: () => void;
  getCurrentChatId: () => string | null;
}

export const AppSidebar = React.forwardRef<AppSidebarRef, AppSidebarProps>(
  function AppSidebar({ onChatSelect, onChatDelete, user, ...props }, ref) {
    const chatHistoryRef = React.useRef<any>(null);

    React.useImperativeHandle(
      ref,
      () => ({
        saveChatHistory: (idea: string, results: any): string | null => {
          if (chatHistoryRef.current) {
            return chatHistoryRef.current.saveChatHistory(idea, results);
          }
          return null;
        },
        resetCurrentChat: (): void => {
          if (chatHistoryRef.current) {
            chatHistoryRef.current.resetCurrentChat();
          }
        },
        getCurrentChatId: (): string | null => {
          return chatHistoryRef.current?.currentChatId || null;
        },
      }),
      []
    );

    return (
      <Sidebar {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-2 cursor-pointer rounded-lg p-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Laptop className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">FoundrGPT</span>
                    <span className="truncate text-xs">Idea Validator</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavChatHistory ref={chatHistoryRef} onChatDelete={onChatDelete} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }
);
