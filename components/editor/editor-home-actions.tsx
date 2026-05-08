"use client"

import { Plus } from "lucide-react"
import { useEditorActions } from "@/components/editor/editor-actions-context"
import { Button } from "@/components/ui/button"

export function EditorHomeActions() {
  const { openCreate } = useEditorActions()

  return (
    <Button
      onClick={openCreate}
      className="gap-2 bg-accent-primary text-bg-base hover:bg-accent-primary/90"
    >
      <Plus className="h-4 w-4" />
      New Project
    </Button>
  )
}
