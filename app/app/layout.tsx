"use client";

import { useRef, useEffect, ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import {
  SidebarProvider as CustomSidebarProvider,
  useSidebarContext,
} from "@/hooks/useSidebarContext";

interface AppLayoutContentProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: AppLayoutContentProps) {
  const { user } = useUser();
  const sidebarRef = useRef<any>(null);
  const { setSidebarRef, handleChatSelect, handleChatDelete } =
    useSidebarContext();

  useEffect(() => {
    setSidebarRef(sidebarRef);
  }, [setSidebarRef]);

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <AppSidebar
          ref={sidebarRef}
          onChatSelect={handleChatSelect}
          onChatDelete={handleChatDelete}
          user={user}
        />
        <SidebarInset className="flex flex-col">
          <header className="shrink-0">
            <AppNavbar />
          </header>

          <div className="flex-1">{children}</div>

          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <CustomSidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </CustomSidebarProvider>
  );
}
