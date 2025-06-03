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
import {
  MessageSquare,
  Trash2,
  Plus,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useState, useImperativeHandle, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ChatHistoryLoadingSkeleton } from "./ui/loading-skeletons";
import { useChatHistory } from "@/hooks/useChatHistory";

export const NavChatHistory = forwardRef(function NavChatHistory(
  { onChatSelect, onChatDelete },
  ref
) {
  const router = useRouter();
  const {
    chatHistories,
    currentChatId,
    isLoading,
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

        {chatHistories && chatHistories.length >= 8 && (
          <div className="px-2 mb-3">
            <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-200">
                {chatHistories.length === 10
                  ? "Maximum chat limit reached (10/10). Delete some chats to create new ones."
                  : `Approaching chat limit (${chatHistories.length}/10). Consider deleting old chats.`}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <SidebarMenu className="space-y-1">
          {isLoading ? (
            <ChatHistoryLoadingSkeleton />
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

                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-auto pl-4">
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
