"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEditorActions } from "@/components/editor/editor-actions-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Project } from "@/lib/projects"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function ProjectItem({
  project,
  isActive,
  onRename,
  onDelete,
}: {
  project: Project
  isActive: boolean
  onRename?: () => void
  onDelete?: () => void
}) {
  const router = useRouter()

  return (
    <div
      className={cn(
        "group relative flex items-center rounded-xl",
        isActive ? "bg-accent-primary-dim" : "hover:bg-bg-elevated",
      )}
    >
      <button
        type="button"
        onClick={() => router.push(`/editor/${project.id}`)}
        className="flex-1 flex items-center gap-2 min-w-0 px-2 py-1.5 text-left"
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0 transition-opacity",
            isActive ? "bg-accent-primary opacity-100" : "opacity-0",
          )}
        />
        <span className="flex-1 text-sm text-text-primary truncate">
          {project.name}
        </span>
      </button>
      {project.owned && (
        <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRename}
            className="h-6 w-6 text-text-muted hover:text-text-primary hover:bg-bg-subtle"
            aria-label="Rename project"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-6 w-6 text-text-muted hover:text-state-error hover:bg-bg-subtle"
            aria-label="Delete project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const { projects, openCreate, openRename, openDelete } = useEditorActions()
  const pathname = usePathname()

  const activeProjectId = pathname.startsWith("/editor/")
    ? pathname.split("/")[2]
    : null

  const ownedProjects = projects.filter((p) => p.owned)
  const sharedProjects = projects.filter((p) => !p.owned)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed top-12 left-0 z-40 h-[calc(100vh-3rem)] w-72",
          "flex flex-col",
          "bg-bg-surface border-r border-border-default",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <span className="text-sm font-medium text-text-primary">
            Projects
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-text-muted hover:text-text-primary hover:bg-bg-elevated"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 px-3 py-3">
          <Tabs
            defaultValue="my-projects"
            className="flex flex-col flex-1 min-h-0"
          >
            <TabsList className="w-full bg-bg-elevated mb-3">
              <TabsTrigger value="my-projects" className="flex-1 text-xs">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1 text-xs">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="flex-1 overflow-y-auto">
              {ownedProjects.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-text-faint">No projects yet.</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {ownedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      isActive={project.id === activeProjectId}
                      onRename={() => openRename(project)}
                      onDelete={() => openDelete(project)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shared" className="flex-1 overflow-y-auto">
              {sharedProjects.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-text-faint">No shared projects.</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {sharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      isActive={project.id === activeProjectId}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="px-3 pb-4">
          <Button
            variant="default"
            onClick={openCreate}
            className="w-full gap-2 bg-accent-primary text-bg-base hover:bg-accent-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
