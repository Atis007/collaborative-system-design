"use client"

import { Circle, Cylinder, Diamond, Hexagon, Pill, RectangleHorizontal } from "lucide-react"
import type { NodeShape } from "@/types/canvas"

export interface ShapeDragPayload {
  shape: NodeShape
  width: number
  height: number
}

const SHAPE_CONFIG: Array<{
  shape: NodeShape
  label: string
  icon: React.ElementType
  width: number
  height: number
}> = [
  { shape: "rectangle", label: "Rectangle", icon: RectangleHorizontal, width: 160, height: 80 },
  { shape: "diamond",   label: "Diamond",   icon: Diamond,             width: 160, height: 120 },
  { shape: "circle",    label: "Circle",    icon: Circle,              width: 100, height: 100 },
  { shape: "pill",      label: "Pill",      icon: Pill,                width: 180, height: 60 },
  { shape: "cylinder",  label: "Cylinder",  icon: Cylinder,            width: 100, height: 120 },
  { shape: "hexagon",   label: "Hexagon",   icon: Hexagon,             width: 120, height: 100 },
]

export function ShapePanel() {
  function onDragStart(event: React.DragEvent, payload: ShapeDragPayload) {
    event.dataTransfer.setData("application/ghost-shape", JSON.stringify(payload))
    event.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-bg-elevated border border-border-default rounded-full shadow-lg">
      {SHAPE_CONFIG.map(({ shape, label, icon: Icon, width, height }) => (
        <button
          key={shape}
          draggable
          onDragStart={(e) => onDragStart(e, { shape, width, height })}
          title={label}
          className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors cursor-grab active:cursor-grabbing"
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  )
}
