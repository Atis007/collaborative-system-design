"use client"

import { Bot, Sparkles } from "lucide-react"
import { useWorkspace } from "@/components/editor/workspace-context"
import { cn } from "@/lib/utils"

export function AISidebar() {
  const { isAISidebarOpen } = useWorkspace()

  return (
    <aside
      aria-hidden={!isAISidebarOpen}
      inert={!isAISidebarOpen}
      className={cn(
        "fixed top-12 right-0 z-40 h-[calc(100vh-3rem)] w-80",
        "flex flex-col",
        "bg-bg-surface border-l border-border-default",
        "transition-transform duration-200 ease-in-out",
        isAISidebarOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex items-start justify-between px-4 py-3 border-b border-border-default">
        <div className="space-y-0.5">
          <span className="text-sm font-medium text-text-primary">
            AI Copilot
          </span>
          <p className="text-xs text-text-muted">Placeholder panel</p>
        </div>
        <Sparkles className="h-4 w-4 text-accent-ai-text mt-0.5 shrink-0" />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="rounded-2xl bg-bg-elevated border border-border-default p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-bg-subtle flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-accent-ai-text" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-text-primary">
                Chat surface pending
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                The toggle is wired. Messaging and generation are intentionally
                out of scope here.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle p-4 space-y-2">
          <p className="text-xs font-mono tracking-widest uppercase text-text-faint">
            Future Hooks
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            Prompt composer, run status, and architecture guidance will attach
            to this sidebar.
          </p>
        </div>
      </div>
    </aside>
  )
}
