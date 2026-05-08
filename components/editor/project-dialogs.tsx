"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { MockProject } from "@/lib/mock-projects"
import { toSlug } from "@/lib/utils"

// ---- Create Project ----

interface CreateProjectDialogProps {
  open: boolean
  name: string
  isLoading: boolean
  onNameChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function CreateProjectDialog({
  open,
  name,
  isLoading,
  onNameChange,
  onSubmit,
  onClose,
}: CreateProjectDialogProps) {
  const slug = toSlug(name)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-bg-elevated border-border-default rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-primary">New Project</DialogTitle>
          <DialogDescription className="text-text-muted">
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <Input
            id="project-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="My Project"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) onSubmit()
            }}
            className="bg-bg-surface border-border-default text-text-primary placeholder:text-text-faint"
          />
          <p className="text-xs text-text-muted font-mono min-h-[1rem]">
            {name.trim() ? slug || "—" : ""}
          </p>
        </div>

        <DialogFooter>
          <Button
            onClick={onSubmit}
            disabled={!name.trim() || isLoading}
            className="bg-accent-primary text-bg-base hover:bg-accent-primary/90"
          >
            {isLoading ? "Creating…" : "Create Project"}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-text-muted hover:text-text-primary"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- Rename Project ----

interface RenameProjectDialogProps {
  open: boolean
  project: MockProject | null
  name: string
  isLoading: boolean
  onNameChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function RenameProjectDialog({
  open,
  project,
  name,
  isLoading,
  onNameChange,
  onSubmit,
  onClose,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-bg-elevated border-border-default rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            Rename project
          </DialogTitle>
          {project && (
            <DialogDescription className="text-text-muted">
              Currently named &quot;{project.name}&quot;
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-2">
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) onSubmit()
            }}
            className="bg-bg-surface border-border-default text-text-primary placeholder:text-text-faint"
          />
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-text-muted hover:text-text-primary"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!name.trim() || isLoading}
            className="bg-accent-primary text-bg-base hover:bg-accent-primary/90"
          >
            {isLoading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- Delete Project ----

interface DeleteProjectDialogProps {
  open: boolean
  project: MockProject | null
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteProjectDialog({
  open,
  project,
  isLoading,
  onConfirm,
  onClose,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-bg-elevated border-border-default rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            Delete project
          </DialogTitle>
          {project && (
            <DialogDescription className="text-text-muted">
              &quot;{project.name}&quot; will be permanently deleted. This
              cannot be undone.
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-text-muted hover:text-text-primary"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
