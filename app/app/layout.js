"use client";

import { useRef, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import {
  SidebarProvider as CustomSidebarProvider,
  useSidebarContext,
} from "@/hooks/useSidebarContext";

function AppLayoutContent({ children }) {
  const { user } = useUser();
  const sidebarRef = useRef();
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
            <Navbar />
          </header>

          <div className="flex-1">{children}</div>

          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default function AppLayout({ children }) {
  return (
    <CustomSidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </CustomSidebarProvider>
  );
}
