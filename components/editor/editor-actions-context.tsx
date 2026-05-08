"use client"

import { createContext, useContext } from "react"
import type { Project } from "@/lib/projects"

interface EditorActionsContextValue {
  projects: Project[]
  openCreate: () => void
  openRename: (project: Project) => void
  openDelete: (project: Project) => void
}

export const EditorActionsContext =
  createContext<EditorActionsContextValue | null>(null)

export function useEditorActions(): EditorActionsContextValue {
  const ctx = useContext(EditorActionsContext)
  if (!ctx) {
    throw new Error("useEditorActions must be used within EditorShell")
  }
  return ctx
}
