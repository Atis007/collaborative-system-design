"use client"

import { createContext, useContext } from "react"
import type { MockProject } from "@/lib/mock-projects"

interface EditorActionsContextValue {
  projects: MockProject[]
  openCreate: () => void
  openRename: (project: MockProject) => void
  openDelete: (project: MockProject) => void
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
