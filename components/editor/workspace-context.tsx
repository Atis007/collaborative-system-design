"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"
import type { Project } from "@/lib/projects"

interface WorkspaceContextValue {
  project: Project | null
  isShareOpen: boolean
  isAISidebarOpen: boolean
  setProject: Dispatch<SetStateAction<Project | null>>
  openShare: () => void
  closeShare: () => void
  toggleAISidebar: () => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false)

  const openShare = useCallback(() => setIsShareOpen(true), [])
  const closeShare = useCallback(() => setIsShareOpen(false), [])
  const toggleAISidebar = useCallback(() => setIsAISidebarOpen((v) => !v), [])

  return (
    <WorkspaceContext.Provider
      value={{
        project,
        setProject,
        isShareOpen,
        isAISidebarOpen,
        openShare,
        closeShare,
        toggleAISidebar,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider")
  return ctx
}
