"use client"

import { useCallback, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import type { Project } from "@/lib/projects"
import { toSlug } from "@/lib/utils"

type DialogType = "create" | "rename" | "delete" | null

export function useProjectActions(
  initialOwned: Project[],
  initialShared: Project[],
) {
  const router = useRouter()
  const pathname = usePathname()

  const isSubmittingRef = useRef(false)

  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const projects: Project[] = [...initialOwned, ...initialShared]

  const openCreate = useCallback(() => {
    setName("")
    setActiveProject(null)
    setDialogType("create")
  }, [])

  const openRename = useCallback((project: Project) => {
    setName(project.name)
    setActiveProject(project)
    setDialogType("rename")
  }, [])

  const openDelete = useCallback((project: Project) => {
    setActiveProject(project)
    setDialogType("delete")
  }, [])

  const close = useCallback(() => {
    setDialogType(null)
    setActiveProject(null)
    setName("")
    setIsLoading(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setIsLoading(true)
    try {
      if (dialogType === "create" && name.trim()) {
        const slug = toSlug(name)
        if (!slug) return
        const suffix = Math.random().toString(36).slice(2, 8)
        const roomId = `${slug}-${suffix}`

        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), roomId }),
        })
        if (!res.ok) throw new Error("Failed to create project")
        const project = await res.json()
        close()
        router.push(`/editor/${project.id}`)
      } else if (dialogType === "rename" && activeProject && name.trim()) {
        const res = await fetch(`/api/projects/${activeProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        })
        if (!res.ok) throw new Error("Failed to rename project")
        close()
        router.refresh()
      } else if (dialogType === "delete" && activeProject) {
        const res = await fetch(`/api/projects/${activeProject.id}`, {
          method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete project")
        close()
        if (pathname === `/editor/${activeProject.id}`) {
          router.push("/editor")
        } else {
          router.refresh()
        }
      }
    } catch {
      // errors are silent; toast system can be added when error UI is defined
    } finally {
      isSubmittingRef.current = false
      setIsLoading(false)
    }
  }, [dialogType, name, activeProject, close, pathname, router])

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
