import { EditorHomeActions } from "@/components/editor/editor-home-actions"

export default function EditorPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-text-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-text-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
      </div>
      <EditorHomeActions />
    </div>
  )
}
