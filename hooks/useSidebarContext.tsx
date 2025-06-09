"use client";

import { createContext, useContext, useRef, useCallback, ReactNode } from "react";
import { ChatHistory, ValidationResults } from "@/types";

interface SidebarContextType {
  sidebarRef: React.MutableRefObject<any>;
  setSidebarRef: (ref: React.MutableRefObject<any>) => void;
  setChatSelectHandler: (handler: (selectedChat: ChatHistory) => void) => void;
  setChatDeleteHandler: (handler: () => void) => void;
  handleChatSelect: (selectedChat: ChatHistory) => void;
  handleChatDelete: () => void;
  saveChatHistory: (idea: string, results: ValidationResults) => string | null;
  resetCurrentChat: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps): JSX.Element {
  const sidebarRef = useRef<any>();
  const chatSelectHandlerRef = useRef<((selectedChat: ChatHistory) => void) | undefined>();
  const chatDeleteHandlerRef = useRef<(() => void) | undefined>();

  const setSidebarRef = useCallback((ref: React.MutableRefObject<any>) => {
    sidebarRef.current = ref.current;
  }, []);

  const setChatSelectHandler = useCallback((handler: (selectedChat: ChatHistory) => void) => {
    chatSelectHandlerRef.current = handler;
  }, []);

  const setChatDeleteHandler = useCallback((handler: () => void) => {
    chatDeleteHandlerRef.current = handler;
  }, []);

  const handleChatSelect = useCallback((selectedChat: ChatHistory) => {
    if (chatSelectHandlerRef.current) {
      chatSelectHandlerRef.current(selectedChat);
    }
  }, []);

  const handleChatDelete = useCallback(() => {
    if (chatDeleteHandlerRef.current) {
      chatDeleteHandlerRef.current();
    }
  }, []);

  const saveChatHistory = useCallback((idea: string, results: ValidationResults): string | null => {
    if (sidebarRef.current && sidebarRef.current.saveChatHistory) {
      return sidebarRef.current.saveChatHistory(idea, results);
    }
    return null;
  }, []);

  const resetCurrentChat = useCallback(() => {
    if (sidebarRef.current && sidebarRef.current.resetCurrentChat) {
      sidebarRef.current.resetCurrentChat();
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        sidebarRef,
        setSidebarRef,
        setChatSelectHandler,
        setChatDeleteHandler,
        handleChatSelect,
        handleChatDelete,
        saveChatHistory,
        resetCurrentChat,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}