"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MessageSquare, Trash2, Plus, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useImperativeHandle, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useChatHistory } from "@/hooks/useChatHistory";

export const NavChatHistory = forwardRef(function NavChatHistory(
  { onChatSelect, onChatDelete },
  ref
) {
  const router = useRouter();
  const {
    chatHistories,
    currentChatId,
    handleChatSelect,
    handleChatDelete,
    saveChatHistory,
    resetCurrentChat,
  } = useChatHistory();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  useImperativeHandle(
    ref,
    () => ({
      saveChatHistory: (idea, results) => {
        return saveChatHistory(idea, results);
      },
      resetCurrentChat,
      currentChatId,
    }),
    [saveChatHistory, resetCurrentChat, currentChatId]
  );

  const handleDeleteClick = (chatId, chatTitle) => {
    setChatToDelete({ id: chatId, title: chatTitle });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      handleChatDelete(chatToDelete.id, onChatDelete);
      setDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  const handleChatClick = (chatId) => {
    router.push(`/app/c/${chatId}`);
  };

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="cursor-pointer rounded-lg">
              <Link
                href="/app"
                className="flex items-center justify-start gap-3 w-full py-2"
              >
                <div className="p-2 rounded-lg text-primary">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="font-medium">New Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-4">
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 px-2">
          Recent Conversations
        </SidebarGroupLabel>
        <SidebarMenu className="space-y-1">
          {!chatHistories || chatHistories.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="bg-muted/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-1">
                No conversations yet
              </p>
              <p className="text-xs text-muted-foreground/60">
                Start a new chat to begin validating your ideas
              </p>
            </div>
          ) : (
            chatHistories.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  asChild
                  isActive={currentChatId === chat.id}
                  className="group relative rounded-lg"
                >
                  <div
                    className="flex items-center w-full p-6 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleChatClick(chat.id)}
                  >
                    {/* Chat info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-muted/50 shrink-0">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="truncate block text-sm font-medium leading-tight mb-0.5">
                          {chat.title || "Untitled Chat"}
                        </span>
                        {chat.timestamp && (
                          <span className="text-xs text-muted-foreground/70 block">
                            {new Date(chat.timestamp).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year:
                                  new Date(chat.timestamp).getFullYear() !==
                                  new Date().getFullYear()
                                    ? "numeric"
                                    : undefined,
                              }
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-auto pl-4">
                      <AlertDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(chat.id, chat.title);
                            }}
                            className="h-8 w-8 p-0 cursor-pointer hover:bg-destructive/10"
                            title="Delete chat"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <Trash2 className="h-5 w-5 text-destructive" />
                              Delete Conversation
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                              Are you sure you want to delete{" "}
                              <strong>
                                "{chatToDelete?.title || "this chat"}"
                              </strong>
                              ?
                              <br />
                              <br />
                              This action cannot be undone and all conversation
                              history will be permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer hover:bg-muted">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={confirmDelete}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
});
