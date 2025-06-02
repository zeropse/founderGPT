"use client";

import { createContext, useContext, useRef, useCallback } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const sidebarRef = useRef();
  const chatSelectHandlerRef = useRef();
  const chatDeleteHandlerRef = useRef();

  const setSidebarRef = useCallback((ref) => {
    sidebarRef.current = ref.current;
  }, []);

  const setChatSelectHandler = useCallback((handler) => {
    chatSelectHandlerRef.current = handler;
  }, []);

  const setChatDeleteHandler = useCallback((handler) => {
    chatDeleteHandlerRef.current = handler;
  }, []);

  const handleChatSelect = useCallback((selectedChat) => {
    if (chatSelectHandlerRef.current) {
      chatSelectHandlerRef.current(selectedChat);
    }
  }, []);

  const handleChatDelete = useCallback(() => {
    if (chatDeleteHandlerRef.current) {
      chatDeleteHandlerRef.current();
    }
  }, []);

  const saveChatHistory = useCallback((idea, results) => {
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

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}
