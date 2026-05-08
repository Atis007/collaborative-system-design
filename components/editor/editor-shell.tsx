"use client"

import { useState } from "react"
import { AISidebar } from "@/components/editor/ai-sidebar"
import { EditorActionsContext } from "@/components/editor/editor-actions-context"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { WorkspaceProvider } from "@/components/editor/workspace-context"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/lib/projects"

interface EditorShellProps {
  children: React.ReactNode
  initialOwned: Project[]
  initialShared: Project[]
}

export function EditorShell({
  children,
  initialOwned,
  initialShared,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const actions = useProjectActions(initialOwned, initialShared)

  return (
    <WorkspaceProvider>
      <EditorActionsContext.Provider
        value={{
          projects: actions.projects,
          openCreate: actions.openCreate,
          openRename: actions.openRename,
          openDelete: actions.openDelete,
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
          <AISidebar />
          <main className="flex-1 mt-12 overflow-hidden">{children}</main>

          <CreateProjectDialog
            open={actions.dialogType === "create"}
            name={actions.name}
            isLoading={actions.isLoading}
            onNameChange={actions.setName}
            onSubmit={actions.handleSubmit}
            onClose={actions.close}
          />
          <RenameProjectDialog
            open={actions.dialogType === "rename"}
            project={actions.activeProject}
            name={actions.name}
            isLoading={actions.isLoading}
            onNameChange={actions.setName}
            onSubmit={actions.handleSubmit}
            onClose={actions.close}
          />
          <DeleteProjectDialog
            open={actions.dialogType === "delete"}
            project={actions.activeProject}
            isLoading={actions.isLoading}
            onConfirm={actions.handleSubmit}
            onClose={actions.close}
          />
        </div>
      </EditorActionsContext.Provider>
    </WorkspaceProvider>
  )
}
