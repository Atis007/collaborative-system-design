"use client"

import { useCallback, useState } from "react"
import { MOCK_PROJECTS, type MockProject } from "@/lib/mock-projects"
import { toSlug } from "@/lib/utils"

type DialogType = "create" | "rename" | "delete" | null

export function useProjectDialogs() {
  const [projects, setProjects] = useState<MockProject[]>(MOCK_PROJECTS)
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [activeProject, setActiveProject] = useState<MockProject | null>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setName("")
    setActiveProject(null)
    setDialogType("create")
  }, [])

  const openRename = useCallback((project: MockProject) => {
    setName(project.name)
    setActiveProject(project)
    setDialogType("rename")
  }, [])

  const openDelete = useCallback((project: MockProject) => {
    setActiveProject(project)
    setDialogType("delete")
  }, [])

  const close = useCallback(() => {
    setDialogType(null)
    setActiveProject(null)
    setName("")
    setIsLoading(false)
  }, [])

  const handleSubmit = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      if (dialogType === "create" && name.trim()) {
        const slug = toSlug(name)
        setProjects((prev) => [
          ...prev,
          { id: Date.now().toString(), name: name.trim(), slug, owned: true },
        ])
      } else if (dialogType === "rename" && activeProject && name.trim()) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === activeProject.id
              ? { ...p, name: name.trim(), slug: toSlug(name) }
              : p,
          ),
        )
      } else if (dialogType === "delete" && activeProject) {
        setProjects((prev) => prev.filter((p) => p.id !== activeProject.id))
      }
      setIsLoading(false)
      close()
    }, 300)
  }, [dialogType, name, activeProject, close])

  return {
    projects,
    dialogType,
    activeProject,
    name,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    setName,
    handleSubmit,
  }
}
