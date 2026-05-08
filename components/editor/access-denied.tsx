import { Lock } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <Lock className="h-8 w-8 text-text-muted" />
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-text-primary">Access denied</p>
        <p className="text-xs text-text-muted">
          This project does not exist or you do not have access to it.
        </p>
      </div>
      <Link href="/editor" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        Back to projects
      </Link>
    </div>
  )
}
