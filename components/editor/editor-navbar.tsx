"use client"

import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"
import { useWorkspace } from "@/components/editor/workspace-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: EditorNavbarProps) {
  const { project, isAISidebarOpen, openShare, toggleAISidebar } =
    useWorkspace()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-3 gap-3 bg-bg-surface border-b border-border-default">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated shrink-0"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>

        {project && (
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold text-text-primary">
              {project.name}
            </span>
            <span className="text-xs text-text-muted mt-0.5">Workspace</span>
          </div>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        {project && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={openShare}
              className="h-8 gap-1.5 text-xs text-text-muted hover:text-text-primary hover:bg-bg-elevated"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAISidebar}
              className={cn(
                "h-8 gap-1.5 text-xs font-medium",
                isAISidebarOpen
                  ? "bg-accent-primary text-bg-base hover:bg-accent-primary/90"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-elevated",
              )}
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </header>
  )
}
