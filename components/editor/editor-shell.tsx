"use client"

import { useState } from "react"
import { EditorActionsContext } from "@/components/editor/editor-actions-context"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

  return (
    <EditorActionsContext.Provider
      value={{
        projects: dialogs.projects,
        openCreate: dialogs.openCreate,
        openRename: dialogs.openRename,
        openDelete: dialogs.openDelete,
      }}
    >
      <div className="h-screen flex flex-col bg-bg-base overflow-hidden">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 mt-12 overflow-hidden">{children}</main>

        <CreateProjectDialog
          open={dialogs.dialogType === "create"}
          name={dialogs.name}
          isLoading={dialogs.isLoading}
          onNameChange={dialogs.setName}
          onSubmit={dialogs.handleSubmit}
          onClose={dialogs.close}
        />
        <RenameProjectDialog
          open={dialogs.dialogType === "rename"}
          project={dialogs.activeProject}
          name={dialogs.name}
          isLoading={dialogs.isLoading}
          onNameChange={dialogs.setName}
          onSubmit={dialogs.handleSubmit}
          onClose={dialogs.close}
        />
        <DeleteProjectDialog
          open={dialogs.dialogType === "delete"}
          project={dialogs.activeProject}
          isLoading={dialogs.isLoading}
          onConfirm={dialogs.handleSubmit}
          onClose={dialogs.close}
        />
      </div>
    </EditorActionsContext.Provider>
  )
}
