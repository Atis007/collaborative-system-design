"use client"

import { Check, Copy, Link2, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Project } from "@/lib/projects"

interface Collaborator {
  id: string
  email: string
  name: string | null
  imageUrl: string | null
}

interface ShareDialogProps {
  project: Project
  open: boolean
  onClose: () => void
}

function CollaboratorAvatar({
  name,
  imageUrl,
  email,
}: {
  name: string | null
  imageUrl: string | null
  email: string
}) {
  const initial = (name ?? email).charAt(0).toUpperCase()

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name ?? email}
        className="h-8 w-8 rounded-full object-cover shrink-0"
      />
    )
  }

  return (
    <div className="h-8 w-8 rounded-full bg-bg-subtle border border-border-default flex items-center justify-center shrink-0">
      <span className="text-xs font-medium text-text-muted">{initial}</span>
    </div>
  )
}

export function ShareDialog({ project, open, onClose }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [isInviting, setIsInviting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    setIsFetching(true)
    setCollaborators([])
    fetch(`/api/projects/${project.id}/collaborators`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: Collaborator[]) => {
        if (!controller.signal.aborted) {
          setCollaborators(data)
          setIsFetching(false)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCollaborators([])
          setIsFetching(false)
        }
      })
    return () => controller.abort()
  }, [open, project.id])

  function handleClose() {
    setInviteEmail("")
    setInviteError(null)
    onClose()
  }

  async function handleInvite() {
    const email = inviteEmail.trim().toLowerCase()
    if (!email) return
    setInviteError(null)
    setIsInviting(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        const collab: Collaborator = await res.json()
        setCollaborators((prev) => [...prev, collab])
        setInviteEmail("")
      } else {
        const body = await res.json().catch(() => ({}))
        setInviteError(
          (body as { error?: string }).error ?? "Failed to invite collaborator",
        )
      }
    } catch {
      setInviteError("Failed to invite collaborator")
    } finally {
      setIsInviting(false)
    }
  }

  async function handleRemove(collaboratorId: string) {
    setRemovingId(collaboratorId)
    try {
      const res = await fetch(
        `/api/projects/${project.id}/collaborators/${collaboratorId}`,
        { method: "DELETE" },
      )
      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId))
      }
    } catch {
      // network error — leave collaborator list unchanged
    } finally {
      setRemovingId(null)
    }
  }

  function handleCopyLink() {
    void navigator.clipboard.writeText(
      `${window.location.origin}/editor/${project.id}`,
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="bg-bg-elevated border-border-default rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            Share &ldquo;{project.name}&rdquo;
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* Copy link */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-surface border border-border-default">
            <Link2 className="h-4 w-4 text-text-muted shrink-0" />
            <span className="flex-1 text-xs text-text-muted truncate">
              {typeof window !== "undefined"
                ? `${window.location.origin}/editor/${project.id}`
                : `/editor/${project.id}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="h-6 gap-1 text-xs text-text-muted hover:text-text-primary hover:bg-bg-elevated shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Invite form — owner only */}
          {project.owned && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-text-secondary">
                Invite by email
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setInviteError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isInviting) void handleInvite()
                  }}
                  placeholder="colleague@example.com"
                  disabled={isInviting}
                  className="flex-1 bg-bg-surface border-border-default text-text-primary placeholder:text-text-faint"
                />
                <Button
                  onClick={() => void handleInvite()}
                  disabled={!inviteEmail.trim() || isInviting}
                  className="shrink-0 bg-accent-primary text-bg-base hover:bg-accent-primary/90"
                >
                  {isInviting ? "Inviting…" : "Invite"}
                </Button>
              </div>
              {inviteError && (
                <p className="text-xs text-state-error">{inviteError}</p>
              )}
            </div>
          )}

          {/* Collaborator list */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-text-secondary">
              {collaborators.length === 0 && !isFetching
                ? "No collaborators yet"
                : "Collaborators"}
            </p>

            {isFetching ? (
              <p className="text-xs text-text-faint py-2">Loading…</p>
            ) : (
              <div className="space-y-1">
                {collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-xl"
                  >
                    <CollaboratorAvatar
                      name={c.name}
                      imageUrl={c.imageUrl}
                      email={c.email}
                    />
                    <div className="flex-1 min-w-0">
                      {c.name ? (
                        <>
                          <p className="text-sm text-text-primary truncate">
                            {c.name}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {c.email}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-text-primary truncate">
                          {c.email}
                        </p>
                      )}
                    </div>
                    {project.owned && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleRemove(c.id)}
                        disabled={removingId === c.id}
                        className="h-7 w-7 text-text-muted hover:text-state-error hover:bg-bg-subtle shrink-0"
                        aria-label={`Remove ${c.name ?? c.email}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
