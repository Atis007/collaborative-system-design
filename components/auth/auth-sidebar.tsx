import { Brain, FileText, Share2 } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export function AuthSidebar() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-1/2 bg-bg-surface border-r border-border-default p-12 justify-between">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-accent-primary" />
        <span className="text-sm font-semibold text-text-primary tracking-tight">
          Ghost AI
        </span>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-text-primary leading-tight mb-4">
          Design systems at the
          <br />
          speed of thought.
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-10">
          Describe your architecture in plain English. Ghost AI maps it to a
          shared canvas your whole team can refine in real time.
        </p>

        <ul className="space-y-6">
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4">
              <div className="shrink-0 h-9 w-9 rounded-xl bg-bg-elevated border border-border-default flex items-center justify-center">
                <Icon className="h-4 w-4 text-accent-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{title}</p>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-text-faint">
        © 2026 Ghost AI. All rights reserved.
      </p>
    </div>
  )
}
